import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){

        case 'GET':
            return getAnswers(req, res);
            
        case 'POST':
            return addAnswers(req, res);
        case 'DELETE':
            return deleteAnswer(req, res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read'});
    }
}

const getAnswers = async (req, res) => {
    try{
        //los datos vienen del req.body
        console.log(req.body);

        const answer = await db.Answer.findAll({
            attributes: ['selection','userId', 'questionId', 'optionId'],
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

const addAnswers = async (req, res) =>  {
    try {

        const answer = await db.Answer.create({...req.body});

        res.status(200).json({
            answer,
            message: 'Respuesta enviada'
        });

    } catch (error) {

        console.log(error);

        let errors = [];
        if (error.errors){
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,
                }));
        }
      return res.status(400).json( {
        error: true,
        message: `Ocurrió un error al procesar la petición: ${error.message}`,
        errors,
        } 
      )
    }
}

const deleteAnswer = async (req,res) => {
    try{
      const {id} = req.query;

        await db.Answer.destroy({
            where: { id: id }
        })

        res.json({
            message: 'Eliminado'
        })

      }
         catch (error){
            res.status(400).json({ error: "error al momento de borrar el estado"})
    }
}