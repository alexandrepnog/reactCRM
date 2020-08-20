import { yupResolver } from '@hookform/resolvers';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Fab,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Paper,
    Switch,
    TextField,
    Typography,
} from '@material-ui/core';
import { AxiosRequestConfig } from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { FcSearch } from 'react-icons/fc';
import { MdAdd } from 'react-icons/md';
import { reactFormatter, ReactTabulator } from 'react-tabulator';

import { apiClient } from '../../assets/js/axios.factory';
import { message } from '../../assets/js/messages';
import PesqCidades from '../pesqCidades';
import helper, { IUsuariosFormData } from './helper';

interface State {
    amount: string;
    password: string;
    weight: string;
    weightRange: string;
    showPassword: boolean;
}

const Usuarios = () => {
    const [lista, setLista] = useState<IUsuariosFormData[]>([]);

    const { handleSubmit, reset, errors, formState, control, setValue } = useForm<IUsuariosFormData>({
        defaultValues: helper.defaultValues,
        resolver: yupResolver(helper.schema),
    });

    const [values, setValues] = React.useState<State>({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        consultar();
    }, []);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openCidade, setOpenCidade] = React.useState(false);

    const abrirPesqCidades = () => {
        setOpenCidade(true);
    };

    const fecharPesqCidades = () => {
        setOpenCidade(false);
    };

    const classes = helper.useStyles();

    function editFunc(event: any, cell: any) {
        let data = { ...cell.getRow().getData() };

        data.dataAniversario = data.dataAniversario.split('T')[0];

        reset(data);

        setOpen(true);
    }

    function cancelar() {
        reset({ ...helper.defaultValues });

        setOpen(false);
    }

    async function deleteFunc(event: any, cell: any) {
        const data = cell.getRow().getData();

        if (!(await message.question(`Confirma a exclusão do usuario : ${data.nome}`))) return;

        await apiClient().delete(`usuarios/${data.id}`);

        cell.getRow().delete();

        reset({ ...helper.defaultValues });

        alert('Sistema excluido com sucesso!');
    }

    const columns = [
        {
            title: 'Exclir',
            formatter: reactFormatter(<FaTrashAlt color='secondary' />),
            headerSort: false,
            cellClick: deleteFunc,
            width: 60,
        },
        {
            title: 'Editar',
            formatter: reactFormatter(<FaEdit />),
            headerSort: false,
            cellClick: editFunc,
            width: 60,
        },
        { title: 'Código', field: 'id', hozAlign: 'left', width: 95 },
        { title: 'Name', field: 'nome', width: 240 },
        { title: 'Login', field: 'login', width: 240 },
        { title: 'Ativo', field: 'ativo', formatter: 'tickCross', width: 90 },
    ];

    const consultar = async () => {
        await apiClient()
            .get('usuarios')
            .then(values => {
                setLista(values.data);
            });
    };

    function retornoPesquisaCidade(data: any) {
        
        setValue('cidade.cidadeId', data.cidadeId);
        setValue('cidade.nome', data.nome);
    }

    const submitForm = handleSubmit(async (data: IUsuariosFormData, event) => {

        event?.preventDefault();                

        // if (!frmSistemas.checkValidity()) {
        //     message.toastError('formulário inválido!');
        //     return;
        //   }

        setOpen(false);

        console.log(data);

        // simulando uma "demora" na resposta do backend
        await new Promise(resolve => setTimeout(resolve, 2000));

        const inserindo = !data.id;

        let response: AxiosRequestConfig | undefined = undefined;

        if (inserindo) {
            response = await apiClient().post('usuarios', data);
            setLista([...lista, response?.data]);
        } else {
            response = await apiClient().put(`usuarios/${data.id}`, data);

            const index = lista.findIndex(function (sistema) {
                return data.id == sistema.id;
            });
            lista.splice(index, 1, response?.data);
        }

        reset({ ...helper.defaultValues });

        message.toastSuccess('Sistema ' + (inserindo ? 'inserido' : 'atualizado') + ' com sucesso.');
    });

    // if (!lista || lista.length == 0) {
    //     return <h1>Carregando...</h1>;
    // }

    return (
        <div className={classes.container}>
            <Paper className={classes.paper}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant='h4'>Cadastro de Usuários</Typography>

                    <Fab onClick={handleClickOpen} color='primary' aria-label='add' disabled={formState.isSubmitting}>
                        <MdAdd />
                    </Fab>
                </Box>

                <Dialog
                    fullWidth
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='form-dialog-title'
                    disableBackdropClick
                    disableEscapeKeyDown
                >
                    <DialogContent>
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='h4'>Cadastro de Usuários</Typography>

                            <Button onClick={cancelar} color='secondary' variant='contained'>
                                Cancelar
                            </Button>
                        </Box>

                        <form onSubmit={submitForm} className={classes.form} noValidate autoComplete='off'>
                            <Controller
                                as={
                                    <TextField
                                        className={classes.textField}
                                        label='Data Aniversário'
                                        type='date'
                                        required
                                        autoFocus
                                        error={!!errors.dataAniversario}
                                        helperText={errors.dataAniversario?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                }
                                control={control}
                                name='dataAniversario'
                                defaultValue=''
                            />
                            <Controller
                                as={
                                    <TextField
                                        type='hidden'
                                        className={classes.textField}
                                        variant='outlined'
                                        error={!!errors.cidade?.cidadeId}
                                        helperText={errors.cidade?.cidadeId?.message}
                                        fullWidth
                                        required
                                    />
                                }
                                control={control}
                                name='cidade.cidadeId'
                                defaultValue=''
                            />

                            <Controller
                                as={
                                    <TextField
                                        className={classes.textField}
                                        label='Clique no botão para pesquisar a cidade.'
                                        variant='outlined'
                                        error={!!errors.cidade?.nome}
                                        helperText={errors.cidade?.nome?.message}
                                        fullWidth
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        aria-label='Clique no botão para pesquisar a cidade.'
                                                        onClick={abrirPesqCidades}
                                                    >
                                                        {<FcSearch />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                }
                                control={control}
                                name='cidade.nome'
                                defaultValue=''
                            />

                            <Dialog
                                fullWidth
                                open={openCidade}
                                onClose={fecharPesqCidades}
                                aria-labelledby='form-dialog-title'
                            >
                                <DialogContent>
                                    <PesqCidades
                                        fecharPesqCidades={fecharPesqCidades}
                                        retornoPesquisaCidade={retornoPesquisaCidade}
                                    />
                                </DialogContent>
                            </Dialog>

                            <Controller
                                as={
                                    <TextField
                                        className={classes.textField}
                                        label='Informe seu Nome.'
                                        variant='outlined'
                                        error={!!errors.nome}
                                        helperText={errors.nome?.message}
                                        fullWidth
                                        required
                                    />
                                }
                                control={control}
                                name='nome'
                                defaultValue=''
                            />

                            <Controller
                                as={
                                    <TextField
                                        className={classes.textField}
                                        label='Informe seu Login.'
                                        variant='outlined'
                                        error={!!errors.login}
                                        helperText={errors.login?.message}
                                        fullWidth
                                        required
                                    />
                                }
                                control={control}
                                name='login'
                                defaultValue=''
                            />

                            <Controller
                                as={
                                    <TextField
                                        label='Senha'
                                        id='outlined-start-adornment'
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        error={!!errors.senha}
                                        helperText={errors.senha?.message}
                                        className={clsx(classes.textField)}
                                        onChange={handleChange('password')}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        aria-label='Clique para ver o password'
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {values.showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant='outlined'
                                    />
                                }
                                control={control}
                                name='senha'
                                defaultValue=''
                            />

                            <Controller
                                name='ativo'
                                control={control}
                                render={({ value, onChange }) => (
                                    <FormControlLabel
                                        label='Usuário Ativo ?'
                                        control={<Switch onChange={e => onChange(e.target.checked)} checked={value} />}
                                    />
                                )}
                            />
                            <Button
                                type='submit'
                                className={classes.button}
                                color='primary'
                                variant='contained'
                                fullWidth
                                disabled={formState.isSubmitting}
                            >
                                salvar
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                <Button
                    onClick={consultar}
                    className={classes.button}
                    color='primary'
                    variant='contained'
                    fullWidth
                    disabled={formState.isSubmitting}
                >
                    Listar
                </Button>

                <ReactTabulator data={lista} columns={columns} tooltips={true} layout={'fitData'} />
            </Paper>
        </div>
    );
};

export default Usuarios;
