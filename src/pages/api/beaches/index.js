import { getBeaches } from "@/server/services/beaches";


export default async function handler(req, res) {

    try {
        if (req.method === "GET") {
          
            const beaches = await getBeaches();
            
            
            return res.status(200).json(beaches) ;  
        }
    } catch (err) {
        console.log(err);
    }
}


