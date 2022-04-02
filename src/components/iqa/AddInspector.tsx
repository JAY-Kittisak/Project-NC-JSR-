import React, { useState } from 'react'
import PlusOneIcon from "@material-ui/icons/Add";

import Button from '../Button';

interface Props {
    inspector: string[]
    setInspector: React.Dispatch<React.SetStateAction<string[]>>
}

const AddInspector: React.FC<Props> = ({ inspector, setInspector }) => {
    const [state, setState] = useState<string>()

    const handleAddInspector = () => {
        if (!state) return
        setInspector([...inspector, state])
    }

    const handleDeleteInspector = () => {
        const fruits = inspector
        fruits.pop()
        console.log('inspector', inspector)
        setInspector(fruits)
    }

    return (
        <>
            <form>
                <div className='flex-between form'>
                    <div className='form-field'>
                        <label htmlFor='inspector'>ผู้ตรวจ / พบ</label>
                        <input
                            type='text'
                            onChange={(e) => setState(e.target.value)}
                        />
                    </div>
                    <Button
                        className='btn--darkcyan'
                        type='reset'
                        onClick={handleAddInspector}
                    >
                        <span>
                            <PlusOneIcon /> เพิ่ม
                        </span>
                    </Button>
                    <button type='button' onClick={handleDeleteInspector}>Delete</button>
                </div>
            </form>
            <div className='grid-inspector'>
                {inspector.map((val, i) => (
                    <p key={i}>{i + 1}. {val}</p>
                ))}
            </div>
        </>
    )
}

export default AddInspector