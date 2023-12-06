import mongooseConnect from "@/lib/mongoose"
import { Setting } from "@/models/Setting"

const handle = async (req,res) => {

    await mongooseConnect()
    
    const {method} = req

    if (method !== 'GET') {
        res.json('must be a GET request')
        return
    }

    if (method ==='GET') {
        const settingDoc = await Setting.find({name: req.query.name})
        //console.log(settingDoc)
        res.json(settingDoc)

    }

}
export default handle