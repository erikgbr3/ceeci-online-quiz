import db from '../../../../database/models';

export default function handler(req,res) {
    switch(req.method) {
        case 'GET':
            return showList(req, res); 
        default:
            res.status(400).json({error: true, message: "Peticion errónea"})
    }
}
const showList = async (req, res) => {
    try {
        //leer la categoria a filtrar
        console.log(req.query)
        const rooms = await db.Room.findOne({
            where: {id: req.query.slug}
        })

        if(!rooms) {
            return  res.status(404).json({
                message: 'El rooms no existe'
            })
        }

        return res.json({...rooms.dataValues}); 
    } catch(error) {
        console.log(error)
        return res.status(400).json(
            {
                error: true,
                message: `Ocurrio un error al procesar la peticion: ${error.message}`        
            }
        )
    
    }
}