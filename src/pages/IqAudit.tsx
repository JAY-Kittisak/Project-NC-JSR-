import React from 'react'
import styled from 'styled-components'

import { MainLayout, InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import { useAuthContext } from '../state/auth-context'
import AddIqa from '../components/iqa/AddIqa'

interface Props { }

const IqAudit: React.FC<Props> = () => {
    // const [alertWarning, setAlertWarning] = useState<AlertNt>('hide');
    // const [alertState, setAlertState] = useState<AlertType>('success');

    const { authState: { userInfo } } = useAuthContext()

    return (
        <MainLayout>
            {/* <AlertNotification
            alertWarning={alertWarning}
            setAlertWarning={setAlertWarning}
            alert={alertState}
        /> */}
            <Title title={'IQA'} span={'Internal Quality Audit'} />
            <IqAuditStyled>
                <InnerLayout className='iqa'>
                    {userInfo?.dept === 'null' ? (
                        <p className='paragraph-null'>User ของคุณยังไม่ได้รับการอนุมัติใช้งาน โปรดแจ้งผู้ดูแลระบบ</p>
                    ) : (
                        <>
                            <AddIqa userInfo={userInfo} />
                        </>
                    )}
                </InnerLayout>
            </IqAuditStyled>
        </MainLayout>
    )
}

const IqAuditStyled = styled.div`
    button {
        margin: 1rem;
        padding: .5rem;
    }
`
export default IqAudit