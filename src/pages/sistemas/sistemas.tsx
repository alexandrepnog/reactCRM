import 'react-tabulator/lib/css/semantic-ui/tabulator_semantic-ui.min.css';

import { yupResolver } from '@hookform/resolvers';
import { Box, Button, Dialog, DialogContent, Fab, FormControlLabel, Paper, Switch, TextField, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { reactFormatter, ReactTabulator } from 'react-tabulator';

import { apiClient } from '../../assets/js/axios.factory';
import { message } from '../../assets/js/messages';
import helper, { ISistemasFormData } from './helper';

const Sistemas = () => {
    const classes = helper.useStyles();

    const [lista, setLista] = useState<ISistemasFormData[]>([]);

    const { register, handleSubmit, reset, errors, formState, setValue, control } = useForm<ISistemasFormData>({
        defaultValues: helper.defaultValues,
        resolver: yupResolver(helper.schema),
    });

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function editFunc(event: any, cell: any) {
        reset({ ...cell.getRow().getData() });
        //setValue('nome', 'teste');

        setOpen(true);
    }

    useEffect(() => {
        consultar();
    }, []);

    function cancelar() {
        reset({ ...helper.defaultValues });

        setOpen(false);
    }

    async function deleteFunc(event: any, cell: any) {
        const data = cell.getRow().getData();

        if (!(await message.question(`Confirma a exclusão do sistema : ${data.nome}`))) return;

        await apiClient().delete(`sistemas/${data.id}`);

        cell.getRow().delete();

        reset({ ...helper.defaultValues });

        alert('Sistema excluido com sucesso!');
    }

    const columns = [
        {
            title: 'Exclir',
            formatter: reactFormatter(<FaTrashAlt />),
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
        { title: 'Ativo', field: 'ativo', formatter: 'tickCross', width: 90 },
    ];

    const consultar = async () => {
        await apiClient()
            .get('sistemas')
            .then(values => {
                setLista(values.data);
            });
    };

    const submitForm = handleSubmit(async (data: ISistemasFormData, event) => {
        event?.preventDefault();

        // if (!frmSistemas.checkValidity()) {
        //     message.toastError('formulário inválido!');
        //     return;
        //   }

        setOpen(false);

        // simulando uma "demora" na resposta do backend
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(data.id);        

        const inserindo = !data.id;

        let response: AxiosRequestConfig | undefined = undefined;

        if (inserindo) {
            response = await apiClient().post('sistemas', data);
            setLista([...lista, response?.data]);
        } else {
            response = await apiClient().put(`sistemas/${data.id}`, data);

            const index = lista.findIndex(function (sistema) {
                return data.id == sistema.id;
            });
            lista.splice(index, 1, response?.data);
        }

        reset({ ...helper.defaultValues });

        message.toastSuccess('Sistema ' + (inserindo ? 'inserido' : 'atualizado') + ' com sucesso.');
    });

    return (
        <div className={classes.container}>
            <Paper className={classes.paper}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant='h4'>Cadastro de Sistemas</Typography>

                    <Fab onClick={handleClickOpen} color='primary' aria-label='add'>
                        <MdAdd />
                    </Fab>
                </Box>

                <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                    <DialogContent>
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='h4'>Cadastro de Sistemas</Typography>

                            <Button onClick={cancelar} color='secondary' variant='contained'>
                                Cancelar
                            </Button>
                        </Box>

                        <form
                            id='frmSistemas'
                            onSubmit={submitForm}
                            className={classes.form}
                            noValidate
                            autoComplete='off'
                        >                            

                            <Controller
                                as={
                                    <TextField
                                        label='Informe o nome do sistema'
                                        variant='outlined'
                                        error={!!errors.nome}
                                        helperText={errors.nome?.message}
                                        fullWidth
                                        required
                                        autoFocus
                                    />
                                }
                                control={control}
                                name='nome'
                                defaultValue=''
                            />

                            <Controller
                                name='ativo'
                                control={control}
                                render={({ value, onChange }) => (
                                    <FormControlLabel
                                        label='Sistema Ativo ?'
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

export default Sistemas;
