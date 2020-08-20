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
        flex: '0 1 37rem',
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
    }
}));

export interface ISistemasFormData {
    id?: number;
    nome: string;
    ativo: boolean;
}

const schema = yup.object().shape<ISistemasFormData>({
    id: yup.number(),
    ativo: yup.boolean().required(),
    nome: yup
        .string()
        .uppercase()
        .trim()
        .required('O nome do sistema deve ser informado')
        .min(4, 'O nome do sistema deve ter 4 ou mais caracteres.'),
});

const defaultValues: ISistemasFormData = {   
    id: 0,
    nome: '',
    ativo: true,
};

export default {
    defaultValues,
    schema,
    useStyles,
};