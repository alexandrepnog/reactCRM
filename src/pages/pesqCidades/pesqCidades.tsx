import 'react-tabulator/lib/css/semantic-ui/tabulator_semantic-ui.min.css';

import { yupResolver } from '@hookform/resolvers';
import { Box, Button, Paper, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import { reactFormatter, ReactTabulator } from 'react-tabulator';

import { apiClient } from '../../assets/js/axios.factory';
import helper, { IPesqCidadesFormData } from './helper';



const PesqCidades = (props: any) => {

    const classes = helper.useStyles();

    const [lista, setLista] = useState<IPesqCidadesFormData[]>([]);

    const { errors, formState, control } = useForm<IPesqCidadesFormData>({
        defaultValues: helper.defaultValues,
        resolver: yupResolver(helper.schema),
    });

    function editFunc(event: any, cell: any) {

        props.retornoPesquisaCidade({ ...cell.getRow().getData() });
        cancelar();
    }

    useEffect(() => {
        consultar();
    }, []);

    function cancelar() {
        props.fecharPesqCidades();
    }

    const columns = [
        {
            title: 'Editar',
            formatter: reactFormatter(<FaEdit />),
            headerSort: false,
            cellClick: editFunc,
            width: 60,
        },
        { title: 'Código', field: 'cidadeId', hozAlign: 'left', width: 95 },
        { title: 'Name', field: 'nome', width: 240 },
    ];

    const consultar = async () => {
        await apiClient()
            .get('cidades')
            .then(values => {
                setLista(values.data);
            });
    };

    return (
        <div className={classes.container}>
            <Paper className={classes.paper}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant='h5'>Pesquisa de Cidades</Typography>

                    <Button onClick={cancelar} color='secondary' variant='contained'>
                        Cancelar
                    </Button>
                </Box>

                <form className={classes.form} noValidate autoComplete='off'>
                    <Controller
                        as={
                            <TextField
                                label='Informe o nome da cidade.'
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
                </form>
            </Paper>
        </div>
    );
};

export default PesqCidades;
