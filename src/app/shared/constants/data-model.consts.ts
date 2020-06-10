import { FormItemDialog } from '../model/form-item.model';

export const EVENTO_FORM: FormItemDialog[] = [
    {
        key: 'nombre',
        value: '',
        title: 'Nombre',
        type: 'text',
        required: true
    },
    {
        key: 'descripcion',
        value: '',
        title: 'Descripción',
        type: 'text',
        required: true
    },
    {
        key: 'clave',
        value: '',
        title: 'Clave',
        type: 'text',
        required: true
    },
    {
        key: 'fechaInicio',
        value: '',
        title: 'Fecha de inicio',
        type: 'date',
        required: true
    },
    {
        key: 'fechaFin',
        value: '',
        title: 'Fecha de cierre',
        type: 'date',
        required: true
    }
]

export const ITINERARIO_FORM: FormItemDialog[] = [
    {
        key: 'nombre',
        value: '',
        title: 'Nombre',
        type: 'text',
        required: true
    },
    {
        key: 'descripcion',
        value: '',
        title: 'Descripción',
        type: 'text',
        required: true
    },
    {
        key: 'ponente',
        value: '',
        title: 'Ponente',
        type: 'text',
        required: false
    },
    {
        key: 'lugar',
        value: '',
        title: 'Lugar',
        type: 'text',
        required: true
    },
    {
        key: 'tipo',
        value: '',
        title: 'Tipo',
        type: 'text',
        required: true
    },
    {
        key: 'fecha',
        value: '',
        title: 'Fecha',
        type: 'date',
        required: true
    },
    {
        key: 'horaInicio',
        value: '',
        title: 'Hora de inicio',
        type: 'time',
        required: true
    },
    {
        key: 'horaFin',
        value: '',
        title: 'Hora de cierre',
        type: 'time',
        required: true
    }
]

export const GALERIA_FORM: FormItemDialog[] = [
    {
        key: 'nombre',
        value: '',
        title: 'Nombre',
        type: 'text',
        required: true
    }
]