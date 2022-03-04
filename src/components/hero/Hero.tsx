import React from 'react';
// import { Link } from 'react-router-dom';

import { ButtonWrapper, Button } from './HeroStyles';
import {useModalContext} from '../../state/modal-context'
interface Props { }

const Hero: React.FC<Props> = () => {
    const {setModalType} = useModalContext()

    return (
        <ButtonWrapper>
            {/* <Link to="login"> */}
            {/* <Button>เข้าสู่ระบบ</Button> */}
            {/* </Link> */}
            <Button onClick={() => setModalType('signIn')}>Sign-In</Button>
            <Button onClick={() => setModalType('signUp')}>Sign-Up</Button>
            {/* <HeroButton>Find More</HeroButton> */}
        </ButtonWrapper>
    );
};
export default Hero;