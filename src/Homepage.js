import React, { useState, useEffect } from 'react';
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
import XLSX from 'xlsx';
import './App.css';



function Homepage() {
    const [bevTypes, setBevTypes] = React.useState([]);
    const [packSizes, setPackSizes] = React.useState([]);
    const [FOSs, setFOSs] = React.useState([]);
    const [currItems, setCurrItems] = React.useState([]);
    const [currItemsNames, setCurrItemsNames] = React.useState([]);


    const [bevType, setBevType] = React.useState('');
    const [FrontlinePrice, setFrontlinePrice] = React.useState(0);
    const [packSize, setPackSize] = React.useState('');
    const [FOS, setFOS] = React.useState('');
    const [currItem, setCurrItem] = React.useState({
        id: 0,
        name: '',
        beverageType: '',
        packageSize: '',
        FrequencyOfSale: 0,
        FrontlinePrice: ''
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

    const calculate = (event) => {


    }

    const handleChangeItem = (event) => {
        setValue(event.target.value);
    };
    const handleChangeBev = (event) => {
        setBevType(event.target.value);
    };
    const handleChangePack = (event) => {
        setPackSize(event.target.value);
    };
    const handleChangeFOS = (event) => {
        setFOS(event.target.value);
    };
    const handleChangeFLP = (event) => {
        setFrontlinePrice(event.target.value);
    };
    const handleChangeCurrItem = (event, values) => {
        setCurrItem(
            values
        )
    };


    const fillFields = (dataParse) => {
        for (var i = 1; i < dataParse.length; i++) {
            if (dataParse[i][0] !== null && typeof dataParse[i][0] !== 'undefined') {
                currItems.push({
                    id: i - 1,
                    name: dataParse[i][0],
                    FrontlinePrice: dataParse[i][1],
                    beverageType: dataParse[i][2],
                    packageSize: dataParse[i][3],
                    FrequencyOfSale: dataParse[i][4],


                })
            }
        }
        setCurrItems(currItems)
        var BT = [...new Set(currItems.map(item => item.beverageType))]
        var PS = [...new Set(currItems.map(item => item.packageSize))]
        var FOS = [...new Set(currItems.map(item => item.FrequencyOfSale))]
        setBevTypes(BT);
        setPackSizes(PS);
        setFOSs(FOS);

    }


    const handleUpload = (e) => {
        e.preventDefault();

        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            let readedData = XLSX.read(data, { type: 'binary' });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
            fillFields(dataParse)

        };
        reader.readAsBinaryString(f)

    }


    return (
        <div>
            <Box display="flex" alignItems="center" justifyContent="space-between" margin="25px">
                <h1>Alliance Beverage Distributing</h1>
                <Button variant="outlined">Log out</Button>

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
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Estimated Frequency of Sales
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value={FOS}
                                onChange={handleChangeFOS}
                            >
                                {FOSs.map((FOS, id) => (
                                    <MenuItem key={id} value={FOS}>
                                        {FOS}
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
                {(value === 10 || value ===20) &&
                        <Button variant="outlined" onClick={async () => {
                            if (value === 10) {
                                const item = { 
                                    bevType, 
                                    FrontlinePrice,
                                    packSize,
                                    FOS }
                                console.log(item)
                                const response = await fetch("/calculate", {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': "application/json"
                                    },
                                    body: JSON.stringify(item)
                                });

                                if (response.ok) {
                                    console.log("Worked!")
                                }
                            }
                            else if (value === 20) {
                                
                                const item = {  
                                    bevType : currItem.beverageType,
                                    FOS : currItem.FrequencyOfSale, 
                                    packsize : currItem.packageSize, 
                                    FrontLinePrice : currItem.FrontlinePrice 
                                }
                                console.log(item)
                                const response = await fetch("/calculate", {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': "application/json"
                                    },
                                    body: JSON.stringify(item)
                                });

                                if (response.ok) {
                                    console.log("Worked!")
                                }
                            }
                        }

                        }
                        >Calculate</Button>
                  
                }
            </div>
        </div >
    );
}

export default Homepage;