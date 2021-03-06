
import { CardContent,Card } from '@material-ui/core';
import { AxiosRequestConfig } from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { isElementOfType } from 'react-dom/test-utils';
import TableDef, { Column } from '../../../components/Table';
import TextFind from '../../../components/TextFind';
import { ColumnsUsuarioDTO,  UsuarioDTO } from '../../../types/UsuarioDTO';
import { SpringPage } from '../../../types/vendor/spring';
import { hasAnyRoles } from '../../../util/auth';
import { requestBackend } from '../../../util/requests';
import {   Edit3 as EditIcon, } from 'react-feather'; 
 
interface ListUserProps {

}

function ListUser({ }: ListUserProps) {
  const [name, setName] = useState('');
  const [page, setPage] = useState<SpringPage<UsuarioDTO>>();
  const [numberPage, setNumberPage] = useState(0);
  const [columns, setcolumns] = useState(ColumnsUsuarioDTO());
  const [status, setstatus] = useState<boolean>(true);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const controller = 'usuarios';

  const onFilter = () => {
  
    const params: AxiosRequestConfig = {
      method: 'GET',
      url: `/${controller}/pageable`,
      params: {
        value: name,
        page: numberPage,
        size: 10,
      },
    };
    requestBackend(params).then(
      (rest) => {
        let data ;
        data=rest.data;
        if(status){
           data.content.forEach(element => {
             element.edit=<a> <EditIcon size='15' /></a>             
           });  
        }
        setPage(data);
        console.log(data);
      }
    );
  }


  useEffect(() => {
    setstatus(hasAnyRoles(['SUPER_ADMINISTRADOR']));
    setcolumns(ColumnsUsuarioDTO());
    console.log(columns);
    if(status){
      let cols:Column[]= ColumnsUsuarioDTO();
      cols.push({ id: "edit", label: "Edit", });
      setcolumns( cols);
    }
    console.log(columns);
    
    onFilter();
  }, [numberPage, name,rowsPerPage]);
//

  return (
    <>
      <Card sx={{ m: 1, mt: 2 ,minHeight:600}}>
        <CardContent>
          <TextFind onFilterName={setName} addVisible={status} onSetPage={()=>setNumberPage(0)} />
          <hr/>
          <TableDef columns={columns} rows={page != null ? page.content : []}
          outPage={setNumberPage} pageCount={page ? page.totalPages : 0} />
        </CardContent>
      </Card>
    </>
  );
}




export default ListUser;