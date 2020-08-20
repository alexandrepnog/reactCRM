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
        flex: '0 1 25rem',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
    form: {
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
    },
    button: {
        margin: '16px 0',
    },
    textField: {
        marginBottom: theme.spacing(3),
    },
}));

export interface IUsuariosFormData {
    id?: number;
    dataAniversario: Date;
    nome: string;
    ativo: boolean;
    login: string;
    senha: string;
    cidade?: {
        cidadeId: number;
        nome: string;
    };
}

const schema = yup.object().shape<IUsuariosFormData>({
    id: yup.number(),
    dataAniversario: yup.date().required('A data de aniversário do usuário deve ser informado'),
    ativo: yup.boolean().required(),
    nome: yup
        .string()
        .uppercase()
        .trim()
        .required('O nome do usuário deve ser informado.')
        .min(4, 'O nome do usuário deve ter 4 ou mais caracteres.'),
    login: yup.string().required('O login deve ser informado.').trim(),
    senha: yup
        .string()
        .trim()
        .required('A senha deve ser informada.')
        .min(6, 'A senha deve conter no mínimo 6 caracteres'),
    //cidade: yup.string().required('A cidade do usuário deve ser informada.').uppercase().trim()
    cidade: yup.object().shape({
        cidadeId: yup.number().required(),
        nome: yup.string().required('O nome da cidade deve ser informado.'),
    }),
});

const defaultValues: IUsuariosFormData = {
    dataAniversario: new Date(),
    nome: '',
    ativo: true,
    login: '',
    senha: '',
    cidade: { cidadeId: 0, nome: '' },
};

export default {
    defaultValues,
    schema,
    useStyles,
};
