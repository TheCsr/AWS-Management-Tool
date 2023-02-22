import * as React from 'react';
import './App.scss';
import 'boxicons/css/boxicons.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Blank from './pages/Blank';
import Storage from "./pages/Storage";
import Instance from "./pages/Compute/Instance";
import * as actionCreators from "./store/actions";
import {useSelector , useDispatch} from "react-redux";
import {bindActionCreators} from "redux";
import { useEffect } from 'react';



function App() {
    const [region, setRegion] = React.useState("eu-north-1");

    const state = useSelector((state)=> state);
    const dispatch = useDispatch();
    const actioncreaters = bindActionCreators(actionCreators, dispatch);
    useEffect(() => {
        actioncreaters.loadBucket();
        actioncreaters.getAllInstances(region);
    },[])

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<AppLayout />}>
                    <Route index element={<Instance region={region}/>} />
                    <Route path='/storage' element={<Storage />} />
                    <Route path='/manage' element={<Blank />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
