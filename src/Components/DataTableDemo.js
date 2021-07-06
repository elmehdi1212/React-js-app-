import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import {GeolocalisationService } from './GeolocalisationService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressBar } from 'primereact/progressbar';
import './DataTableDemo.css';

const DataTableDemo = () => {
    const [customers, setCustomers] = useState(null);
    const[id,setId]=useState(0); 
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedRepresentatives, setSelectedRepresentatives] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const dt = useRef(null);
    const representatives = [
    ];

    const statuses = [
       
    ];

    const service = new GeolocalisationService();

    useEffect(() => {
        service.getUsers().then(res =>setCustomers(res.data));
        if(id !== 0) {
            service.getFriends(id).then(res =>setCustomers(res.data));
        }
    }, [id]); 
  

    const renderHeader = () => {
        return (
            <div className="table-header">
                La liste des utilisateurs
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" />
                </span>
            </div>
        );
    }

    const activityBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={rowData.activity} showValue={false} />
            </React.Fragment>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <Button onClick={() => setId(rowData.id)}   type="button"  className="p-button-success">Amis</Button>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Status</span>
                <span className={classNames('customer-badge', 'status-' + rowData.id)}>{rowData.id}</span>
            </React.Fragment>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.nom}
            </React.Fragment>
        );
    }
    const prenomBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.prenom}
            </React.Fragment>
        );
    }
    const sexeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.sexe}
            </React.Fragment>
        );
    }


    const countryBodyTemplate = (rowData) => {
    
        return (
            <React.Fragment>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </React.Fragment>
        );
    }

    const representativeBodyTemplate = (rowData) => {
       

        return (
            <React.Fragment>
                <span className="p-column-title">Imei</span>
                {rowData.imei}
            </React.Fragment>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date de Naissance</span>
                <span>{rowData.date_naissance}</span>
            </React.Fragment>
        );
    }

    const renderRepresentativeFilter = () => {
        return (
            <MultiSelect className="p-column-filter" value={selectedRepresentatives} options={representatives}
                onChange={onRepresentativeFilterChange} itemTemplate={representativeItemTemplate} placeholder="All" optionLabel="name" optionValue="name" />
        );
    }

    const representativeItemTemplate = (option) => {
        const src = "showcase/demo/images/avatar/" + option.image;

        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={src} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" style={{verticalAlign: 'middle'}} />
                <span style={{verticalAlign: 'middle', marginLeft: '.5em'}}>{option.name}</span>
            </div>
        );
    }

    const onRepresentativeFilterChange = (event) => {
        dt.current.filter(event.value, 'representative.name', 'in');
        setSelectedRepresentatives(event.value);
    }

    const renderDateFilter = () => {
        return (
            <Calendar value={dateFilter} onChange={onDateFilterChange} placeholder="Registration Date" dateFormat="yy-mm-dd" className="p-column-filter" />
        );
    }

    const onDateFilterChange = (event) => {
        if (event.value !== null)
            dt.current.filter(formatDate(event.value), 'date', 'equals');
        else
            dt.current.filter(null, 'date', 'equals');

        setDateFilter(event.value);
    }

    const filterDate = (value, filter) => {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === formatDate(filter);
    }

    const formatDate = (date) => {
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return  day+'/'+ month + '/' +date.getFullYear();
    }

    const renderStatusFilter = () => {
        return (
            <Dropdown value={selectedStatus} options={statuses} onChange={onStatusFilterChange}
                        itemTemplate={statusItemTemplate} showClear placeholder="Select a Status" className="p-column-filter"/>
        );
    }

    const statusItemTemplate = (option) => {
        return (
            <span className={classNames('customer-badge', 'status-' + option)}>{option}</span>
        );
    }

    const onStatusFilterChange = (event) => {
        dt.current.filter(event.value, 'status', 'equals');
        setSelectedStatus(event.value);
    }

    const header = renderHeader();
    const representativeFilterElement = renderRepresentativeFilter();
    const dateFilterElement = renderDateFilter();
    const statusFilterElement = renderStatusFilter();


    const [showFriends, setShowFriends] = useState(false);

    return (
        <div className="datatable-doc-demo">
            <div className="card">
                <DataTable ref={dt} value={customers}
                    header={header} className="p-datatable-customers" dataKey="id" rowHover globalFilter={globalFilter}
                    selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                    paginator rows={10} emptyMessage="Aucun Utilisateur" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}>
                    <Column selectionMode="All" style={{width:'3em'}}/>
                    <Column field="status" header="Id" body={statusBodyTemplate}  />
                    <Column field="name" header="Nom" body={nameBodyTemplate} />
                    <Column field="name" header="Prenom" body={prenomBodyTemplate}  />
    
                    <Column sortField="country.name" filterField="country.name" header="Email" body={countryBodyTemplate} />
                    <Column sortField="representative.name" filterField="representative.name" header="Telephone" body={representativeBodyTemplate}  />
                    <Column field="date" header="Date" body={dateBodyTemplate}   />
                    <Column field="activity" header="Sexe" body={sexeBodyTemplate} />
                    <Column body={actionBodyTemplate} headerStyle={{width: '8em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}}/>
                </DataTable>
            </div>
            {showFriends && (
                <div className="Friends">

                </div>
            )} 
        </div>
    );
}

export default DataTableDemo;