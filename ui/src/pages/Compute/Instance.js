import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import * as actionCreators from "../../store/actions";
import { visuallyHidden } from '@mui/utils';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useCallback } from 'react';
import { bindActionCreators } from "redux";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import MenuIcon from '@mui/icons-material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip'

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'Name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'Id',
        numeric: true,
        disablePadding: false,
        label: 'Instance Id',
    },
    {
        id: 'imageid',
        numeric: true,
        disablePadding: false,
        label: 'Image Id',
    },
    {
        id: 'instancetype',
        numeric: true,
        disablePadding: false,
        label: 'Instance Type',
    },
    {
        id: 'keypair',
        numeric: true,
        disablePadding: false,
        label: 'Key Pair',
    },
    {
        id: 'securitygroup',
        numeric: true,
        disablePadding: false,
        label: 'Security Group',
    },
    {
        id: 'Status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, listOfI, changeLoaderT, changeLoaderF, region } = props;
    const [file, setFile] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const onInputChange = (e) => {
        setFile(e.target.files[0])
    }

    const dispatch = useDispatch();
    const actioncreaters = bindActionCreators(actionCreators, dispatch);

    const handleGetObject = async (name) => {
        await changeLoaderT();
        await actioncreaters.getObjects(name);
        await changeLoaderF();
    };

    const handleDialogClick = () => {
        setOpen(!open);
    }

    const handleStart = async () => {
        await actioncreaters.startInstance(listOfI);
        await actioncreaters.getAllInstances(region);
    }

    const handleStop = async () => {
        await actioncreaters.stopInstance(listOfI);
        await actioncreaters.getAllInstances(region);
    }
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Instances

                </Typography>
            )}

            {numSelected == 1 ? (
                <div>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" component="label" onClick={handleStart}>
                            Start
                        </Button>
                        <Button variant="contained" size="large" onClick={handleStop}>Stop</Button>
                    </Stack>
                </div>
            ) : (
                <div>
                    <Stack spacing={2} direction="row">
                        <Box>
                            <Button variant="contained" component="label">
                                Create
                            </Button>
                        </Box>
                        <Tooltip title="Filter list">
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>

                    </Stack>
                </div>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    listOfI: PropTypes.arrayOf.isRequired,
    changeLoaderT: PropTypes.oneOfType.isRequired,
    changeLoaderF: PropTypes.oneOfType.isRequired,
};

export default function Instance(props) {
    const { region } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(8);

    const [searched, setSearched] = React.useState("");

    const [rows, setRows] = React.useState([{ "Id": "", "Status": "", "imageid": "", "instancetype": "", "keypair": "", "securitygroup": [], "tags": [] }])

    // this is the loader for the object section
    const [loader, setLoader] = React.useState(false);

    const changeLoaderT = () => {
        setLoader(true)
    }

    const changeLoaderF = () => {
        setLoader(false)
    }

    console.log("selected", selected);

    //finished here


    // for state update

    const instanceData = useSelector((state) => state.instances.data);
    const dispatch = useDispatch();
    const actioncreaters = bindActionCreators(actionCreators, dispatch);

    useEffect(() => {
        if (instanceData) {
            setRows(instanceData.data);
        }
    }, [instanceData])


    const requestSearch = (e) => {
        e.preventDefault()
        if (e.target.value !== "") {
            setSearched(e.target.value);
            let filteredData = instanceData.data.filter((row) => {
                return (row["Status"].toLowerCase().includes(searched.toLowerCase()) || row["groupName"].toLowerCase().includes(searched.toLowerCase()) || row["Name"].toLowerCase().includes(searched.toLowerCase()));
            });
            setRows(filteredData);
        } else if (e.target.value === "") {
            setSearched(e.target.value);
            setRows(instanceData.data)
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.Id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <div>
            <Box sx={{ width: '99%' }}>

                <TextField
                    fullWidth
                    label="Universal Search For Instances"
                    id="fullWidth"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        startAdornment: (
                            <InputAdornment position="start">
                                <MenuIcon />
                            </InputAdornment>
                        ),
                    }}
                    value={searched}
                    onChange={(e) => requestSearch(e)}
                />
            </Box>
            <br></br>

            <Box sx={{ width: '99%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} listOfI={selected} changeLoaderT={changeLoaderT} changeLoaderF={changeLoaderF} region={region} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {rows.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.Id);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            (instanceData && instanceData.data.length) > 1 ? (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.Id)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.Id}
                                                    selected={isItemSelected}
                                                >

                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        {row.Name}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        {row.Id}
                                                    </TableCell>
                                                    <TableCell align="right">{row.imageid}</TableCell>
                                                    <TableCell align="right">{row.instancetype}</TableCell>
                                                    <TableCell align="right">{row.keypair}</TableCell>
                                                    <TableCell align="right">{row.groupName}</TableCell>
                                                    {
                                                        row.Status === "running" ? (
                                                            <TableCell align="right">
                                                                <Chip label={row.Status} color="primary" />
                                                            </TableCell>
                                                        ) :
                                                            (
                                                                <TableCell align="right">
                                                                    <Chip label={row.Status} />
                                                                </TableCell>

                                                            )
                                                    }


                                                </TableRow>
                                            ) : (
                                                <div>
                                                    <CircularProgress color="secondary" />
                                                </div>
                                            )
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </div >



    );
}