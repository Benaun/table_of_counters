import axios from "axios"

export const deleteCounter = async (id:string) => {
    return await axios.delete(`http://showroom.eis24.me/api/v4/test/meters/${id}`)
}