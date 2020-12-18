import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import './App.css';



function Homepage() {

    const [bevTypes, setBevTypes] = React.useState([]);
    const [packSizes, setPackSizes] = React.useState([]);
    const [currItems, setCurrItems] = React.useState([]);

    const [FalseAttempt, setFalseAttempt] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [bevType, setBevType] = React.useState('');
    const [FrontlinePrice, setFrontlinePrice] = React.useState(0);
    const [packSize, setPackSize] = React.useState('');
    const [currItem, setCurrItem] = React.useState({
        id: 0,
        name: '',
        itemKey: ''
    });

    const filterOptions = createFilterOptions({
        limit: '50',
        ignoreCase: true
    });

    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 280,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        input: {
            display: 'none',
        },
    }));
    const classes = useStyles();
    const [value, setValue] = React.useState('');
    const [loaded, setLoaded] = React.useState(false);


    const handleChangeItem = (event) => {
        setValue(event.target.value);
    };
    const handleChangeBev = (event) => {
        setBevType(event.target.value);
    };
    const handleChangePack = (event) => {
        setPackSize(event.target.value);
    };
    const handleChangeFLP = (event) => {
        setFrontlinePrice(event.target.value);
    };
    const handleChangeCurrItem = (event, values) => {
        setCurrItem(values)
    };


    const fillFields = (dataParse) => {
        for (var i = 0; i < dataParse.length; i++) {
            if (dataParse[i][0] !== null) {
                currItems.push({
                    id: i,
                    name: dataParse[i].ItemName,
                    itemKey: dataParse[i].ItemKey
                })

                packSizes.push(dataParse[i].Package)
                bevTypes.push(dataParse[i].BeverageType)

            }
        }
        setCurrItems(currItems)
        const bt = [...new Set(bevTypes)]
        setBevTypes(bt)
        const ps = [...new Set(packSizes)]
        setPackSizes(ps)
        setLoaded(true)

    }

    const FormData = require('form-data');

    const handleUpload = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('file', e.target.files[0]);
        let config = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }



        axios.post(`http://brandapp.alliancebeverage.com:80/upload`, form, config).then(res => {
            fillFields(res.data)
        })
    };


    const AttemptLogIn = (e) => {
        const creds = {
            username: username,
            password: password,
        }
        let config = {
            headers: {
                "Access-Control-Max-Age": "300",
                "contentType" : "text/plain"
            }
        }
        axios.post(`http://brandapp.alliancebeverage.com:80/login`, { creds }, config).then(res => {
            if (201 === res.status) {
                setLoggedIn(true)
            } else {
                setFalseAttempt(true)
            }
        }).catch(error => {
            console.log(error);
        })

    }


    return (

        <div>
            {loggedIn === true &&
                <div>
                    <Box display="flex" alignItems="center" justifyContent="space-between" margin="25px">
                        <h1>Alliance Beverage Distributing</h1>
                        <Button variant="outlined" onClick={async () => { setLoggedIn(false) }}>
                            Log out</Button>

                    </Box>
                    <div className="App">
                        <input
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            id="contained-button-file"
                            className={classes.input}
                            type="file"
                            onChange={(event) => {
                                handleUpload(event)
                            }}
                            onClick={(event) => {
                                event.target.value = null
                            }}
                        />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span">
                                Upload
                            </Button>
                        </label>
                        {loaded === true &&
                            <div>
                                <div>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-label">Is this is a new or existing product?</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={value}
                                            onChange={handleChangeItem}
                                        >
                                            <MenuItem value={10}>New Item</MenuItem>
                                            <MenuItem value={20}>Existing Item</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                {value === 10 &&
                                    <Box flexDirection="column" display="flex" alignItems="center" >
                                        <h3>New Product</h3>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                                Beverage Type
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-placeholder-label-label"
                                                id="demo-simple-select-placeholder-label"
                                                value={bevType}
                                                onChange={handleChangeBev}
                                                input={<Input />}
                                            >
                                                {bevTypes.map((bevType, id) => (
                                                    <MenuItem key={id} value={bevType}>
                                                        {bevType}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl className={classes.formControl}>
                                            <TextField
                                                onChange={handleChangeFLP}
                                                id="standard-number"
                                                label="Frontline Price (in US Dollars)"
                                                value={FrontlinePrice}
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                                Package Size
                                        </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-placeholder-label-label"
                                                id="demo-simple-select-placeholder-label"
                                                value={packSize}
                                                onChange={handleChangePack}
                                            >
                                                {packSizes.map((packSize, id) => (
                                                    <MenuItem key={id} value={packSize}>
                                                        {packSize}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                }
                                {value === 20 &&
                                    <Box flexDirection="column" display="flex" alignItems="center" >
                                        <h3>Existing Product</h3>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                                Item Name
                                            </InputLabel>
                                            <Autocomplete
                                                filterOptions={filterOptions}
                                                id="clear-on-escape"
                                                clearOnEscape
                                                value={currItem}
                                                onChange={handleChangeCurrItem}
                                                getOptionLabel={option => option.name}
                                                options={currItems}
                                                style={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Existing Product" margin="normal" />}
                                            />

                                        </FormControl>
                                    </Box>
                                }
                                {(value === 10 || value === 20) &&
                                    <Button variant="outlined" onClick={async () => {
                                        if (value === 10) {
                                            const data = {
                                                bevType,
                                                FrontlinePrice,
                                                packSize,
                                            }
                                            let config = {
                                                headers: {
                                                    "Access-Control-Allow-Origin": "*",
                                                }
                                            }
                                            axios({
                                                method: "post",
                                                url: `http://brandapp.alliancebeverage.com:80/calculateNew`,
                                                data: data,
                                                headers: {
                                                    "Access-Control-Allow-Origin": "*",
                                                },
                                                responseType: 'arraybuffer',
                                            })
                                                .then((response) => {
                                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.setAttribute('download', 'customerNew.xlsx'); //or any other extension
                                                    document.body.appendChild(link);
                                                    link.click();
                                                })
                                                .catch(error => {
                                                    console.log(error);
                                                })
                                        }
                                        else if (value === 20) {
                                            const data = {
                                                ItemKey: currItem.itemKey
                                            }
                                            let config = {
                                                headers: {
                                                    "Access-Control-Allow-Origin": "*",
                                                }
                                            }

                                            axios({
                                                method: "post",
                                                url: `http://brandapp.alliancebeverage.com:80/calculateExisting`,
                                                data: data,
                                                headers: {
                                                    "Access-Control-Allow-Origin": "*",
                                                },
                                                responseType: 'arraybuffer',
                                            })
                                                .then((response) => {
                                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.setAttribute('download', 'customerExisting.xlsx'); //or any other extension
                                                    document.body.appendChild(link);
                                                    link.click();
                                                })
                                                .catch(error => {
                                                    console.log(error);
                                                })
                                        }
                                    }

                                    }
                                    >Calculate</Button>

                                }
                            </div>
                        }

                    </div>

                </div>
            }
            {loggedIn === false &&
                <div>
                    <Box display="flex" alignItems="center" justifyContent="space-between" margin="25px">
                        <h1>Alliance Beverage Distributing</h1>

                    </Box>
                    <div className="App">
                        <Box flexDirection="column" display="flex" alignItems="center" >

                            <TextField
                                id="username"
                                label="Username"
                                style={{ margin: 16 }}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                style={{ marginBottom: 24 }}
                                id="password"
                                label="Password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                onClick={(e) => {
                                    AttemptLogIn(e)
                                }}>
                                Log In
                            </Button>
                            {FalseAttempt === true &&
                                <b>Incorrect Credentials! Contact System Admin if problem persists</b>
                            }

                        </Box>
                    </div>
                </div>
            }
        </div >

    );
}

export default Homepage;