import React from 'react'

import { IqaAnswer, IqaType } from '../../types'

interface Props {
    labelRef: React.RefObject<HTMLDivElement>
    iqaDetail: IqaType
    iqaAnswer: IqaAnswer
}

const IqaPrint: React.FC<Props> = ({ labelRef, iqaDetail, iqaAnswer }) => {

    return (
        <div ref={labelRef}>
            <p>{iqaDetail.id}</p>
            <p>{iqaAnswer.answerName}</p>
        </div>
    )
}

export default IqaPrint