import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

const token = "IxBSr7gT0NIKMS0cty7dkF1uvyt7Q1eG7lhepbpDeG6";
const tokenCdc = "Feg1407WsyiJDDWzubQlQzDbvUllAljcrUsCyGn9Vyk";
const lineNotifyUrl = "https://notify-api.line.me/api/notify";

const env = functions.config();
const ncNotifyCollection = "nc-notify";
const ncCountsCollection = "nc-counts";
const ncCountsCdcCollection = "nc-counts-cdc";
const ncCodeCountsCollection = "nc-code-counts";
const ncCodeCountsCdcCollection = "nc-code-counts-cdc";
const ncCountsDocument = "counts";
const usersCollection = "users";
const userCountsCollection = "user-counts";
const userCountsDocument = "counts";

type Branch = "ลาดกระบัง" | "ชลบุรี"
type Role = "SUPER_ADMIN" | "CLIENT" | "ADMIN"
type StatusNc = "รอตอบ"| "ตอบแล้ว"| "รอปิด"| "ไม่อนุมัติ" | "ปิดแล้ว"
type CatNc = "NCR" | "CCR" | "SCR"
type TopicType = "Product" | "Product"
type CountsCode = {counts: number}
type Counts = {
  [key in "All" | CatNc | StatusNc]: number
}
type UserCreator = {
  id: string
  username: string
  dept: string
  email: string
}
type NcrNotify = {
  code: string
  category: CatNc
  dept: string
  topic: string
  topicType: TopicType
  detail: string
  fileNcUrl?: string
  fileNcRef?: string
  fileNcName?: string
  ncStatus: StatusNc
  branch: string
  creator: UserCreator
}

export const onSignup = functions.https.onCall(async (data, context) => {
  try {
    const {username} = data as { username: string };

    if (!context.auth?.uid) return;

    // 1. Create a role on the user in the firebase authentication
    await admin.auth().setCustomUserClaims(context.auth.uid, {
      role:
        context.auth.token.email === env.admin.super_admin ?
          "SUPER_ADMIN" :
          "CLIENT",
    });

    // 2. Create a new user document in the users collection in firestore
    const result = await admin
        .firestore()
        .collection("users")
        .doc(context.auth?.uid)
        .set({
          username,
          email: context.auth.token.email,
          role:
          context.auth.token.email === env.admin.super_admin ?
            "SUPER_ADMIN" :
            "CLIENT",
          branch: "ลาดกระบัง",
          dept: "null",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    if (!result) return;

    return {message: "User has been created on firestore."};
  } catch (error) {
    throw error;
  }
});

export const updateUser = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) throw new Error("Not authenticated");

    const {
      userId,
      newRole,
      newBranch,
      newDept,
    } = data as {
      userId: string;
      newRole: Role;
      newBranch: Branch;
      newDept: string;
    };

    // Check Authorization
    const adminUser = await admin.auth().getUser(context.auth.uid);

    const {role} = adminUser.customClaims as {role: Role};

    if (role !== "SUPER_ADMIN") throw new Error("No authorization");

    // Update the auth user (Authentication)
    await admin.auth().setCustomUserClaims(userId, {role: newRole});

    // Update the user in the users collection (firestore)
    return admin
        .firestore()
        .collection(usersCollection)
        .doc(userId)
        .set(
            {
              role: newRole,
              branch: newBranch,
              dept: newDept,
            },
            {
              merge: true,
            }
        );
  } catch (error) {
    throw error;
  }
});

export const onUserCreated = functions.firestore
    .document(`${usersCollection}/{userId}`)
    .onCreate(async (snapshot, context) => {
    // Query the user-counts/counts from firestore
      const countsData = await admin
          .firestore()
          .collection(userCountsCollection)
          .doc(userCountsDocument)
          .get();

      if (!countsData.exists) {
      // The first user has been created
        return admin
            .firestore()
            .collection(userCountsCollection)
            .doc(userCountsDocument)
            .set({userCounts: 1});
      } else {
        const {userCounts} = countsData.data() as { userCounts: number };

        return admin
            .firestore()
            .collection(userCountsCollection)
            .doc(userCountsDocument)
            .set({userCounts: userCounts + 1});
      }
    });

const lineNotify = async (
    code: string,
    username: string,
    dept: string,
    topic: string,
    url: string
) => {
  const topicUrl = `ประเด็นความไม่สอดคล้อง: ${topic}\nตอบ NC คลิก: ${url}`;

  try {
    await axios({
      method: "post",
      url: lineNotifyUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`,
      },
      data: `message=เลขที่ ${code}\nFrom: ${username}\nTo: ${dept}\n${topicUrl}`,
    }).then((response) => {
      console.log("Line Notify response status:", response.status);
    });

    console.log("Notify Success");
  } catch (err) {
    console.log("Notify Error!");
    console.log(err);
  }
};

const lineNotifyCdc = async (
    code: string,
    username: string,
    dept: string,
    topic: string,
    url: string
) => {
  const topicUrl = `ประเด็นความไม่สอดคล้อง: ${topic}\nตอบ NC คลิก: ${url}`;

  try {
    await axios({
      method: "post",
      url: lineNotifyUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${tokenCdc}`,
      },
      data: `message=เลขที่ ${code}\nFrom: ${username}\nTo: ${dept}\n${topicUrl}`,
    }).then((response) => {
      console.log("Line Notify response status:", response.status);
    });

    console.log("Notify Success");
  } catch (err) {
    console.log("Notify Error!");
    console.log(err);
  }
};

export const onNcCreated = functions.firestore
    .document(`${ncNotifyCollection}/{ncId}`)
    .onCreate(
        async (snapshot, context) => {
          const nc = snapshot.data() as NcrNotify;

          let counts: Counts;
          let countsCode: CountsCode;

          // Query the nc-counts collection
          const countsData = await admin
              .firestore()
              .collection(ncCountsCollection)
              .doc(ncCountsDocument)
              .get();


          // Query the nc-counts-cdc collection
          const countsDataCdc = await admin
              .firestore()
              .collection(ncCountsCdcCollection)
              .doc(ncCountsDocument)
              .get();

          // Query the nc-code-counts collection
          const today = new Date();
          const currentFullYear = today.getFullYear().toString();
          const currentMonth = today.getMonth() + 1;
          const padCurrentMonth = currentMonth.toString().padStart(2, "0");

          const countsDataCode = await admin
              .firestore()
              .collection(ncCodeCountsCollection)
              .doc(`J-${nc.category}${currentFullYear}${padCurrentMonth}`)
              .get();

          const countsDataCodeCdc = await admin
              .firestore()
              .collection(ncCodeCountsCdcCollection)
              .doc(`C-${nc.category}${currentFullYear}${padCurrentMonth}`)
              .get();

          if (nc.branch === "ลาดกระบัง") {

            lineNotify(
                nc.code,
                nc.creator.username,
                nc.dept,
                nc.topic,
                "jsr-nc.web.app/nc/answer"
            );

            if (!countsData.exists) {
              // First nc item

              // Construct the counts object
              counts = {
                All: 1,
                รอตอบ: nc.ncStatus === "รอตอบ" ? 1 : 0,
                ตอบแล้ว: nc.ncStatus === "ตอบแล้ว" ? 1 : 0,
                รอปิด: nc.ncStatus === "รอปิด" ? 1 : 0,
                ไม่อนุมัติ: nc.ncStatus === "ไม่อนุมัติ" ? 1 : 0,
                ปิดแล้ว: nc.ncStatus === "ปิดแล้ว" ? 1 : 0,
                NCR: nc.category === "NCR" ? 1 : 0,
                CCR: nc.category === "CCR" ? 1 : 0,
                SCR: nc.category === "SCR" ? 1 : 0,
              };
            } else {
              const {
                All,
                รอตอบ,
                ตอบแล้ว,
                รอปิด,
                ไม่อนุมัติ,
                ปิดแล้ว,
                NCR,
                CCR,
                SCR,
              } = countsData.data() as Counts;

              counts = {
                All: All + 1,
                รอตอบ: nc.ncStatus === "รอตอบ" ? รอตอบ + 1 : รอตอบ,
                ตอบแล้ว: nc.ncStatus === "ตอบแล้ว" ? ตอบแล้ว + 1 : ตอบแล้ว,
                รอปิด: nc.ncStatus === "รอปิด" ? รอปิด + 1 : รอปิด,
                ไม่อนุมัติ: nc.ncStatus === "ไม่อนุมัติ" ?
                  ไม่อนุมัติ + 1 : ไม่อนุมัติ,
                ปิดแล้ว: nc.ncStatus === "ปิดแล้ว" ? ปิดแล้ว + 1 : ปิดแล้ว,
                NCR: nc.category === "NCR" ? NCR + 1 : NCR,
                CCR: nc.category === "CCR" ? CCR + 1 : CCR,
                SCR: nc.category === "SCR" ? SCR + 1 : SCR,
              };
            }

            // Counts Code
            if (!countsDataCode.exists) {
              countsCode = {counts: 1};
            } else {
              const {counts} = countsDataCode.data() as CountsCode;
              countsCode = {counts: counts + 1};
            }

            const updateCount = admin
                .firestore()
                .collection(ncCountsCollection)
                .doc(ncCountsDocument)
                .set(counts);

            const updateCountCode = admin
                .firestore()
                .collection(ncCodeCountsCollection)
                .doc(`J-${nc.category}${currentFullYear}${padCurrentMonth}`)
                .set(countsCode);

            // Update the counts document in the nc-counts collection
            return {updateCount, updateCountCode};
          } else {

            lineNotifyCdc(
                nc.code,
                nc.creator.username,
                nc.dept,
                nc.topic,
                "jsr-nc.web.app/nc/answer"
            );

            if (!countsDataCdc.exists) {
              // First nc item

              // Construct the counts object
              counts = {
                All: 1,
                รอตอบ: nc.ncStatus === "รอตอบ" ? 1 : 0,
                ตอบแล้ว: nc.ncStatus === "ตอบแล้ว" ? 1 : 0,
                รอปิด: nc.ncStatus === "รอปิด" ? 1 : 0,
                ไม่อนุมัติ: nc.ncStatus === "ไม่อนุมัติ" ? 1 : 0,
                ปิดแล้ว: nc.ncStatus === "ปิดแล้ว" ? 1 : 0,
                NCR: nc.category === "NCR" ? 1 : 0,
                CCR: nc.category === "CCR" ? 1 : 0,
                SCR: nc.category === "SCR" ? 1 : 0,
              };
            } else {
              const {
                All,
                รอตอบ,
                ตอบแล้ว,
                รอปิด,
                ไม่อนุมัติ,
                ปิดแล้ว,
                NCR,
                CCR,
                SCR,
              } = countsDataCdc.data() as Counts;

              counts = {
                All: All + 1,
                รอตอบ: nc.ncStatus === "รอตอบ" ? รอตอบ + 1 : รอตอบ,
                ตอบแล้ว: nc.ncStatus === "ตอบแล้ว" ? ตอบแล้ว + 1 : ตอบแล้ว,
                รอปิด: nc.ncStatus === "รอปิด" ? รอปิด + 1 : รอปิด,
                ไม่อนุมัติ: nc.ncStatus === "ไม่อนุมัติ" ?
                  ไม่อนุมัติ + 1 : ไม่อนุมัติ,
                ปิดแล้ว: nc.ncStatus === "ปิดแล้ว" ? ปิดแล้ว + 1 : ปิดแล้ว,
                NCR: nc.category === "NCR" ? NCR + 1 : NCR,
                CCR: nc.category === "CCR" ? CCR + 1 : CCR,
                SCR: nc.category === "SCR" ? SCR + 1 : SCR,
              };
            }

            // Counts Code
            if (!countsDataCodeCdc.exists) {
              countsCode = {counts: 1};
            } else {
              const {counts} = countsDataCodeCdc.data() as CountsCode;
              countsCode = {counts: counts + 1};
            }

            const updateCountCdc = admin
                .firestore()
                .collection(ncCountsCdcCollection)
                .doc(ncCountsDocument)
                .set(counts);

            const updateCountCodeCdc = admin
                .firestore()
                .collection(ncCodeCountsCdcCollection)
                .doc(`C-${nc.category}${currentFullYear}${padCurrentMonth}`)
                .set(countsCode);

            // Update the counts document in the nc-counts collection
            return {updateCountCdc, updateCountCodeCdc};
          }
        });
