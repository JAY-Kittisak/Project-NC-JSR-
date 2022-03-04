import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";

import { AlertNotify } from '../../helpers'
import { AlertType } from '../../types'

interface Props {
    alertWarning: AlertNotify
    setAlertWarning: React.Dispatch<React.SetStateAction<AlertNotify>>
    alert: AlertType
}

interface AlertProps {
    alert: AlertType
}

function alertBackground(value: AlertType) {
    if (value === 'warning') return '#ffdb9b'
    else if (value === 'success') return '#a5e9b3'
}

function alertBorder(value: AlertType) {
    if (value === 'warning') return '#ffa502'
    else if (value === 'success') return '#2daf42'
}

function alertColor(value: AlertType) {
    if (value === 'warning') return '#ce8500'
    else if (value === 'success') return '#18a830'
}

const AlertNotification: React.FC<Props> = ({ alertWarning, setAlertWarning, alert }) => {
    const [showAlert, setShowAlert] = useState("")

    useEffect(() => {
        if (alertWarning !== "hide") {

            setShowAlert("showAlert")

            setTimeout(() => {
                setAlertWarning("hide");
            }, 4000);
        }
    }, [alertWarning, setAlertWarning, showAlert])

    return (
        <AlertStyled alert={alert}>
            <div className={`alert ${showAlert} ${alertWarning}`}>
                <div className='check-icon'>
                    {alert === 'warning' ? <CheckCircleIcon /> : <ErrorIcon />}
                </div>
                <span className="msg">
                    {alert === 'warning' ? 'แจ้งเตือน: คุณไม่สามารถเข้าถึงข้อมูลนี้ได้' : 'บันทึกข้อมูลสำเร็จ'}
                </span>
                <span className="close-btn" onClick={() => setAlertWarning("hide")}>
                    <div className='close-icon'>
                        <CloseIcon />
                    </div>
                </span>
            </div>
        </AlertStyled>
    )
}

const AlertStyled = styled.div`
    position: fixed;
    right: 0;
    width: 6.5rem;
    height: 2.5rem;
    z-index: 15;

    .alert {
        background: ${(props: AlertProps) => alertBackground(props.alert)};
        padding: 15px 40px;
        min-width: 420px;
        position: absolute;
        right: 0px;
        top: -30px;
        overflow: hidden;
        border-radius: 4px;
        border-left: 8px solid ${(props: AlertProps) => alertBorder(props.alert)};
        opacity: 0;
        pointer-events: none;
    }

    .alert.showAlert{
        opacity: 1;
        pointer-events: auto;
    }

    .alert.show{
        animation: show_slide 1s ease forwards;
    }

    @keyframes show_slide {
        0%{
            transform: translateX(100%)
        }
        40%{
            transform: translateX(-10%)
        }
        80%{
            transform: translateX(0%)
        }
        100%{
            transform: translateX(-10px)
        }
    }

    .alert.hide{
        animation: hide_slide 1s ease forwards;
    }

    @keyframes hide_slide {
        0%{
            transform: translateX(-10px)
        }
        40%{
            transform: translateX(0%)
        }
        80%{
            transform: translateX(-10%)
        }
        100%{
            transform: translateX(100%)
        }
    }

    .alert .check-icon svg {
        position: absolute;
        left: 60px;
        text-align: center;
        transform: translate(-50px);
        color: ${(props: AlertProps) => alertColor(props.alert)};
        font-size: 30px;
    }

    .alert .close-icon {
        svg {
            color: ${(props: AlertProps) => alertColor(props.alert)};
            font-size: 30px;
        }
    }

    .alert .msg{
        padding: 0 20px;
        font-size: ${(props: AlertProps) => props.alert === 'warning' ? '16px' : '18px'};
        color: ${(props: AlertProps) => alertColor(props.alert)};
    }

    .alert .close-btn{
        position: absolute;
        right: 0px;
        top: 1%;
        transform: translateY(-1%);
        background: ${(props: AlertProps) => props.alert === 'warning' ? '#ffd080' : '#46ce61'};
        padding: 13px 18px;
        cursor: pointer;
    }

    .close-btn:hover{
        background: ${(props: AlertProps) => props.alert === 'warning' ? '#ffc766' : '#33be4a'};
    }
`
export default AlertNotification