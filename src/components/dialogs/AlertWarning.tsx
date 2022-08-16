import React, {useState, useEffect}  from 'react'
import styled, { keyframes } from 'styled-components'
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";

interface Props { }

const AlertWarning: React.FC<Props> = () => {
    const [alertWarning, setAlertWarning] = useState("show")

    useEffect(() => {
        if (alertWarning !== "hide") {
            const hideWarning = setTimeout(() => {
                setAlertWarning("hide");
            }, 4000);
            
            return () => clearTimeout(hideWarning)
        }
    }, [alertWarning])

    return (
        <AlertStyled>
            <div className={`alert showAlert ${alertWarning}`}>
                <div className='check-icon'>
                    <ErrorIcon />
                </div>
                <span className="msg">
                    แจ้งเตือน: คุณไม่สามารถเข้าถึงข้อมูลนี้ได้
                </span>
                <span 
                    className="close-btn" 
                    onClick={() => {
                        setAlertWarning("hide")
                    }}
                >
                    <div className='close-icon'>
                        <CloseIcon />
                    </div>
                </span>
            </div>
        </AlertStyled>
    )
}

const show_slide = keyframes`
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
`

const hide_slide = keyframes`
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
`

const AlertStyled = styled.div`
    position: fixed;
    top: 50px;
    right: 0;
    z-index: 15;

    .alert {
        background: #ffdb9b;
        padding: 15px 40px;
        min-width: 380px;
        position: absolute;
        right: 0px;
        top: -30px;
        overflow: hidden;
        border-radius: 4px;
        border-left: 8px solid #ffa502;
        opacity: 0;
        pointer-events: none;
    }
    
    .alert.showAlert{
        opacity: 1;
        pointer-events: auto;
    }

    .alert.show{
        animation: ${show_slide} 1s ease forwards;
    }

    .alert.hide{
        animation: ${hide_slide} 1s ease forwards;
    }

    .alert .close-icon {
        svg {
            color: #ce8500;
            font-size: 30px;
        }
    }

    .alert .check-icon svg {
        position: absolute;
        top: 12px;
        transform: translate(-30px);
        color: #ce8500;
        font-size: 30px;
    }

    .alert .msg{
        padding: 0 10px;
        font-size: 16px;
        color: #ce8500;
    }

    .alert .close-btn{
        position: absolute;
        right: 10px;
        top: 10px;
        background: '#ffd080';
        cursor: pointer;
    }

    .close-btn:hover{
        background: '#ffc766';
    }
`

export default AlertWarning