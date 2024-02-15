import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){

        case 'GET':
            return getAnswers(req, res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read'});
    }
}

const getAnswers = async (req, res) => {
    try{
        //los datos vienen del req.body
        console.log(req.body);
        //guardar cliente
        const answer = await db.Answer.findAll({
            attributes: ['userId', 'questionId', 'optionId']
        });
        return res.json(answer)
    
    }catch(error){
        console.log(error);
        let errors = []

        if(error.errors){
            //extrae la info
            errors = error.errors.map((item) => ({
                error: item.message, 
                field: item.path,
            }));
        }

        return res.status(400).json({
            message: `Ocurrió un error al procesar la petición: ${error.message}`,
            errors,
        })
    }
}