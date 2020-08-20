import { makeStyles } from '@material-ui/core';
import * as yup from 'yup';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        flex: '0 1 26rem',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
    form: {
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
    },
    button:{
        margin: '16px 0'
    },
    FaTrashAlt:{
        cursor: 'pointer'
    }
}));

export interface IPesqCidadesFormData {
    cidadeId?: number;
    nome: string;
}

const schema = yup.object().shape<IPesqCidadesFormData>({
    cidadeId: yup.number(),
    nome: yup
        .string()
        .uppercase()
        .trim()
        .required('O nome da cidade para pesquisa deve ser informado')
        .min(4, 'O nome da cidade para pesquisa deve ter 3 ou mais caracteres.'),
});

const defaultValues: IPesqCidadesFormData = {   
    cidadeId: 0,
    nome: ''
};

export default {
    defaultValues,
    schema,
    useStyles,
};