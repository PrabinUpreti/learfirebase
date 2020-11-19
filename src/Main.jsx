import "./Main.css"
import { useEffect, useState } from "react"
import { fb } from "./ENV.js"

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function Main() {
    const submitData = (e) => {
        setDisableBtn(true)
        e.preventDefault();
        let fs = fb.firestore()
        let ref = fs.collection("database")
        if (add) {
            ref.add({
                value: item
            }).then(res => {
                // console.log(res);
                setItem("")
                setDisableBtn(false)
            })

        }
        else {

            ref.doc(editId).update({
                value: item
            }).then(res => {
                // console.log(res);
                setItem("")
                setEditId("")
                setAdd(true)
                setDisableBtn(false)
            })
        }
    }
    const deleteItem = id => {
        // e.preventDefault();
        let fs = fb.firestore()
        let ref = fs.collection("database").doc(id)
        ref.delete()
        setAdd(true)
        setItem("")

    }
    const editItem = (id, value) => {
        console.log(id, value);
        setItem(value)
        setAdd(false)
        setEditId(id)
    }
    const [data, setData] = useState([])
    const [isData, setIsData] = useState(false)
    const [item, setItem] = useState("")
    const [add, setAdd] = useState(true)
    const [editId, setEditId] = useState("")
    const [disableBtn, setDisableBtn] = useState(false)
    useEffect(() => {
        let fs = fb.firestore()
        let ref = fs.collection("database")
        ref.onSnapshot(responseData => {
            setData([])
            !responseData.empty ?
                responseData.docs.map((value, index) => {
                    let val = { value: value.data().value, id: value.id }
                    setData((old) => [...old, val])
                    // console.log(value);
                    setIsData(true)
                }) : setIsData(false)
        })
    }, [])
    return (
        <div className="container">
            {/* {console.log(data)} */}
            <form>
                <TextField size="small" id="outlined-basic" onChange={(e) => { setItem(e.target.value) }} value={item} label="Item" variant="outlined" />
                <Button disabled={disableBtn} onClick={(e) => { submitData(e) }} color="primary" variant="contained"> {add ? "Add" : "Update"} </Button>
                {!add ?
                    <Button onClick={() => {
                        setAdd(true)
                        setItem("")
                        setEditId("")
                    }} color="secondary" variant="contained"> Cancel </Button> : null}
            </form>
            <div>
                {isData ?
                    data.map((v, index) => {
                        return <div className="list" key={v.id}>
                            <div className="content">
                                <p key={v.id}>{v.value} </p>
                            </div>
                            <div className="action">
                                <span onClick={() => { editItem(v.id, v.value) }}>Edit</span>
                                <span onClick={() => { deleteItem(v.id) }}>Delete</span>
                            </div>
                        </div>
                    })
                    : <p>No Data</p>}
            </div>
        </div>
    )
}