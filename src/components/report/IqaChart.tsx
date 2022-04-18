import React from 'react'
import { NcrNotify } from '../../types'

interface Props { }

type deptType =  
    | 'SC'
    | 'SA'
    | 'QMR'
    | 'PU'
    | 'MK'
    | 'IV'
    | 'HR'
    | 'EN'
    | 'DL'
    | 'AD'
    | 'AC'
type deptDemoCounts = { [key in deptType]: NcrNotify[]}

const initialArrDemo: deptDemoCounts = {
    SC: [],
    SA: [],
    QMR: [],
    PU: [],
    IV: [],
    MK: [],
    HR: [],
    EN: [],
    DL: [],
    AD: [],
    AC: [],
}

const IqaChart: React.FC<Props> = () => {
    return (
        <div>
            {Object.keys(initialArrDemo).map((item, i) => (
                <div key={i}>{item}</div>
            ))}
        </div>
    )
}

export default IqaChart