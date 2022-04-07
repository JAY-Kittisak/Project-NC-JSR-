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

const iqaCollection = "iqa";
const iqaCountsCollection = "iqa-counts";
const iqaCountsCdcCollection = "iqa-counts-cdc";
const iqaCodeCountsCollection = "iqa-code-counts";
const iqaCodeCountsCdcCollection = "iqa-code-counts-cdc";

type Branch = "ลาดกระบัง" | "ชลบุรี"
type Role = "SUPER_ADMIN" | "CLIENT" | "ADMIN"
type StatusNc =
  |"รอตอบ"
  | "ตอบแล้ว"
  | "รอปิด"
  | "ไม่อนุมัติ"
  | "ปิดแล้ว"
  | "ยกเลิก"

type CatNc = "NCR" | "CCR" | "SCR"
type TopicType = "Product" | "Product"
type CountsCode = { counts: number }
type Counts = {
  [key in "All" | CatNc | StatusNc]: number
}
type IqaCounts = {
  [key in "All" | StatusNc]: number
}
type UserCreator = {
  id: string
  username: string
  dept: string
  email: string
}
type NcrNotify = {
  creatorName: string
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

type CatIqa = "CAR" | "OBS"
type Team = "A" | "B" | "C" |"B"

type Requirements =
    | "4.1" | "4.2" | "4.3" | "4.4.1" | "5.1.1" | "5.1.2" | "5.2.1" | "5.2.2"
    | "5.3" | "6.1"| "6.1.2" | "6.2.1" | "6.2.2" | "6.3" | "7.1.1" | "7.1.2"
    | "7.1.3" | "7.1.4" | "7.1.5.1" | "7.1.5.2" | "7.1.6" | "7.2" | "7.3"
    | "7.4" | "7.5.1" | "7.5.2" | "7.5.3.1" | "7.5.3.2"| "8.2.1" | "8.2.2"
    | "8.2.3.1" | "8.2.3.2" | "8.2.4" | "8.3" | "8.4" | "8.4.1" | "8.4.2"
    | "8.4.3" | "8.5.1" | "8.5.2" | "8.5.3" | "8.5.4" | "8.5.5" | "8.5.6"
    | "8.6" | "8.7.1"| "8.7.2" | "9.1.1" | "9.1.2" | "9.1.3" | "9.2.1"
    | "9.2.2" | "9.3.1" | "9.3.2" | "9.3.3"| "10.1" | "10.2.1" | "10.2.2"
    | "10.3"

type IqaType = {
    id: string
    code: string
    category: CatIqa
    toName: string
    dept: string
    checkedProcess: string
    requirements: Requirements
    inspector1: string
    inspector2: string | null
    inspector3: string | null
    inspector4: string | null
    team: Team
    round: string
    detail: string
    fileIqaUrl?: string
    fileIqaRef?: string
    fileIqaName?: string
    iqaStatus: StatusNc
    branch: Branch
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

    const {role} = adminUser.customClaims as { role: Role };

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

const lineNotify = async (message: string) => {
  try {
    await axios({
      method: "post",
      url: lineNotifyUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`,
      },
      data: message,
    }).then((response) => {
      console.log("Line Notify response status:", response.status);
    });

    console.log("Notify Success");
  } catch (err) {
    console.log("Notify Error!");
    console.log(err);
  }
};

const lineNotifyCdc = async (message: string) => {
  try {
    await axios({
      method: "post",
      url: lineNotifyUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${tokenCdc}`,
      },
      data: message,
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

          const message = "message= เลขที่ " + nc.code + "\nจาก: " +
          nc.creatorName + " แผนก " + nc.creator.dept + "\nถึงแผนก: " +
          nc.dept + "\nประเด็น: " + nc.topic +
        "\nสถานะ: " + nc.ncStatus + "\nตอบ NC คลิก: jsr-nc.web.app";

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
            lineNotify(message);

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
                ยกเลิก: nc.ncStatus === "ยกเลิก" ? 1 : 0,
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
                ยกเลิก,
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
                ยกเลิก: nc.ncStatus === "ยกเลิก" ? ยกเลิก + 1 : ยกเลิก,
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
            lineNotifyCdc(message);

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
                ยกเลิก: nc.ncStatus === "ยกเลิก" ? 1 : 0,
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
                ยกเลิก,
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
                ยกเลิก: nc.ncStatus === "ยกเลิก" ? ยกเลิก + 1 : ยกเลิก,
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

export const onNcUpdated = functions.firestore
    .document(`${ncNotifyCollection}/{ncId}`)
    .onUpdate(async (snapshot, context) => {
      const beforeProd = snapshot.before.data() as NcrNotify;
      const afterProd = snapshot.after.data() as NcrNotify;

      const message = "message= เลขที่ " + afterProd.code + "\nจาก: " +
    afterProd.creatorName + " แผนก " + afterProd.creator.dept + "\nถึงแผนก: " +
    afterProd.dept + "\nประเด็น: " + afterProd.topic + "\nสถานะ: " +
      afterProd.ncStatus + "\nตอบ NC คลิก: jsr-nc.web.app";

      // Check if the status has been changed
      if (beforeProd.ncStatus !== afterProd.ncStatus) {
      // If status is changed
        if (afterProd.branch === "ลาดกระบัง") {
          lineNotify(message);

          const countsData = await admin
              .firestore()
              .collection(ncCountsCollection)
              .doc(ncCountsDocument)
              .get();

          if (!countsData.exists) return;

          const counts = countsData.data() as Counts;

          // Update the counts object
          counts[beforeProd.ncStatus] = counts[beforeProd.ncStatus] - 1;
          counts[afterProd.ncStatus] = counts[afterProd.ncStatus] + 1;

          await admin
              .firestore()
              .collection(ncCountsCollection)
              .doc(ncCountsDocument)
              .set(counts);
        } else {
          lineNotifyCdc(message);

          const countsDataCdc = await admin
              .firestore()
              .collection(ncCountsCdcCollection)
              .doc(ncCountsDocument)
              .get();

          if (!countsDataCdc.exists) return;

          const countsCdc = countsDataCdc.data() as Counts;

          // Update the counts object
          countsCdc[beforeProd.ncStatus] = countsCdc[beforeProd.ncStatus] - 1;
          countsCdc[afterProd.ncStatus] = countsCdc[afterProd.ncStatus] + 1;

          await admin
              .firestore()
              .collection(ncCountsCdcCollection)
              .doc(ncCountsDocument)
              .set(countsCdc);
        }
      }
    }
    );

export const onIqaCreated = functions.firestore
    .document(`${iqaCollection}/{iqaId}`)
    .onCreate(
        async (snapshot, context) => {
          const iqa = snapshot.data() as IqaType;

          let counts: IqaCounts;
          let countsCode: CountsCode;

          // Query the nc-counts collection
          const countsData = await admin
              .firestore()
              .collection(iqaCountsCollection)
              .doc(ncCountsDocument)
              .get();

          // Query the nc-counts-cdc collection
          const countsDataCdc = await admin
              .firestore()
              .collection(iqaCountsCdcCollection)
              .doc(ncCountsDocument)
              .get();

          // Query the nc-code-counts collection
          const today = new Date();
          const currentFullYear = today.getFullYear().toString();

          const countsDataCode = await admin
              .firestore()
              .collection(iqaCodeCountsCollection)
              .doc(`J-${iqa.category}${iqa.round}${iqa.team}${currentFullYear}`)
              .get();

          const countsDataCodeCdc = await admin
              .firestore()
              .collection(iqaCodeCountsCdcCollection)
              .doc(`C-${iqa.category}${iqa.round}${iqa.team}${currentFullYear}`)
              .get();

          if (iqa.branch === "ลาดกระบัง") {
            // lineNotify(message);

            if (!countsData.exists) {
              // First nc item

              // Construct the counts object
              counts = {
                All: 1,
                รอตอบ: iqa.iqaStatus === "รอตอบ" ? 1 : 0,
                ตอบแล้ว: iqa.iqaStatus === "ตอบแล้ว" ? 1 : 0,
                รอปิด: iqa.iqaStatus === "รอปิด" ? 1 : 0,
                ไม่อนุมัติ: iqa.iqaStatus === "ไม่อนุมัติ" ? 1 : 0,
                ปิดแล้ว: iqa.iqaStatus === "ปิดแล้ว" ? 1 : 0,
                ยกเลิก: iqa.iqaStatus === "ยกเลิก" ? 1 : 0,
              };
            } else {
              const {
                All,
                รอตอบ,
                ตอบแล้ว,
                รอปิด,
                ไม่อนุมัติ,
                ปิดแล้ว,
                ยกเลิก,
              } = countsData.data() as IqaCounts;

              counts = {
                All: All + 1,
                รอตอบ: iqa.iqaStatus === "รอตอบ" ? รอตอบ + 1 : รอตอบ,
                ตอบแล้ว: iqa.iqaStatus === "ตอบแล้ว" ? ตอบแล้ว + 1 : ตอบแล้ว,
                รอปิด: iqa.iqaStatus === "รอปิด" ? รอปิด + 1 : รอปิด,
                ไม่อนุมัติ: iqa.iqaStatus === "ไม่อนุมัติ" ?
                  ไม่อนุมัติ + 1 : ไม่อนุมัติ,
                ปิดแล้ว: iqa.iqaStatus === "ปิดแล้ว" ? ปิดแล้ว + 1 : ปิดแล้ว,
                ยกเลิก: iqa.iqaStatus === "ยกเลิก" ? ยกเลิก + 1 : ยกเลิก,
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
                .collection(iqaCountsCollection)
                .doc(ncCountsDocument)
                .set(counts);

            const updateCountCode = admin
                .firestore()
                .collection(iqaCodeCountsCollection)
                .doc("J-"+iqa.category+iqa.round+iqa.team+currentFullYear)
                .set(countsCode);

            // Update the counts document in the nc-counts collection
            return {updateCount, updateCountCode};
          } else {
            // lineNotifyCdc(message);

            if (!countsDataCdc.exists) {
              // First nc item

              // Construct the counts object
              counts = {
                All: 1,
                รอตอบ: iqa.iqaStatus === "รอตอบ" ? 1 : 0,
                ตอบแล้ว: iqa.iqaStatus === "ตอบแล้ว" ? 1 : 0,
                รอปิด: iqa.iqaStatus === "รอปิด" ? 1 : 0,
                ไม่อนุมัติ: iqa.iqaStatus === "ไม่อนุมัติ" ? 1 : 0,
                ปิดแล้ว: iqa.iqaStatus === "ปิดแล้ว" ? 1 : 0,
                ยกเลิก: iqa.iqaStatus === "ยกเลิก" ? 1 : 0,
              };
            } else {
              const {
                All,
                รอตอบ,
                ตอบแล้ว,
                รอปิด,
                ไม่อนุมัติ,
                ปิดแล้ว,
                ยกเลิก,
              } = countsDataCdc.data() as IqaCounts;

              counts = {
                All: All + 1,
                รอตอบ: iqa.iqaStatus === "รอตอบ" ? รอตอบ + 1 : รอตอบ,
                ตอบแล้ว: iqa.iqaStatus === "ตอบแล้ว" ? ตอบแล้ว + 1 : ตอบแล้ว,
                รอปิด: iqa.iqaStatus === "รอปิด" ? รอปิด + 1 : รอปิด,
                ไม่อนุมัติ: iqa.iqaStatus === "ไม่อนุมัติ" ?
                  ไม่อนุมัติ + 1 : ไม่อนุมัติ,
                ปิดแล้ว: iqa.iqaStatus === "ปิดแล้ว" ? ปิดแล้ว + 1 : ปิดแล้ว,
                ยกเลิก: iqa.iqaStatus === "ยกเลิก" ? ยกเลิก + 1 : ยกเลิก,
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
                .collection(iqaCountsCdcCollection)
                .doc(ncCountsDocument)
                .set(counts);

            const updateCountCodeCdc = admin
                .firestore()
                .collection(iqaCodeCountsCdcCollection)
                .doc("C-"+iqa.category+iqa.round+iqa.team+currentFullYear)
                .set(countsCode);

            // Update the counts document in the nc-counts collection
            return {updateCountCdc, updateCountCodeCdc};
          }
        }
    );

export const onIqaUpdated = functions.firestore
    .document(`${iqaCollection}/{iqaId}`)
    .onUpdate(async (snapshot, context) => {
      const beforeProd = snapshot.before.data() as IqaType;
      const afterProd = snapshot.after.data() as IqaType;

      // FIXME:  const message =

      // Check if the status has been changed
      if (beforeProd.iqaStatus !== afterProd.iqaStatus) {
        // If status is changed
        if (afterProd.branch === "ลาดกระบัง") {
          // FIXME: lineNotify(message);

          const countsData = await admin
              .firestore()
              .collection(iqaCountsCollection)
              .doc(ncCountsDocument)
              .get();

          if (!countsData.exists) return;

          const counts = countsData.data() as IqaCounts;

          // Update the counts object
          counts[beforeProd.iqaStatus] = counts[beforeProd.iqaStatus] - 1;
          counts[afterProd.iqaStatus] = counts[afterProd.iqaStatus] + 1;

          await admin
              .firestore()
              .collection(iqaCountsCollection)
              .doc(ncCountsDocument)
              .set(counts);
        } else {
          // FIXME: lineNotifyCdc(message);

          const countsDataCdc = await admin
              .firestore()
              .collection(iqaCountsCdcCollection)
              .doc(ncCountsDocument)
              .get();

          if (!countsDataCdc.exists) return;

          const countsCdc = countsDataCdc.data() as IqaCounts;

          // Update the counts object
          countsCdc[beforeProd.iqaStatus] = countsCdc[beforeProd.iqaStatus] - 1;
          countsCdc[afterProd.iqaStatus] = countsCdc[afterProd.iqaStatus] + 1;

          await admin
              .firestore()
              .collection(iqaCountsCdcCollection)
              .doc(ncCountsDocument)
              .set(countsCdc);
        }
      }
    }
    );
