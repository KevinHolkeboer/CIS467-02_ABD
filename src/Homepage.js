import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import './App.css';

function Homepage() {
    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 280,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));
    const classes = useStyles();
    const [item, setItem] = React.useState('');

    const handleChange = (event) => {
        setItem(event.target.value);
    };

    return (
        <div>
            <Box display="flex" alignItems = "center" justifyContent = "space-between" margin="25px">
            <h1>Alliance Beverage Distributing</h1>
            <Button variant="outlined">Log out</Button>
            </Box>
            <div className="App">
                <Button variant="outlined">Upload Data</Button>
                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Is this is a new or existing product?</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={item}
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>New Item</MenuItem>
                            <MenuItem value={20}>Existing Item</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {item == 10 &&
                    <Box flexDirection="column" display="flex" alignItems = "center" >
                        <h3>New Product</h3>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Beverage Type
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value="placeholder"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Placeholder</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Frontline Price
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value="placeholder"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Placeholder</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Package Size
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value="placeholder"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Placeholder</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Estimated Frequency of Sales
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value="placeholder"
                                
                            >
                                <MenuItem value={10}>Placeholder</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="outlined">Calculate</Button>
                </Box>
                }
                {item == 20 &&
                    <Box flexDirection="column" display="flex" alignItems = "center" >
                        <h3>Existing Product</h3>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Item Name
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                value="placeholder"
                                
                            >
                                <MenuItem value={10}>Placeholder</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="outlined">Calculate</Button>
                </Box>
                }
            </div>
        </div>
    );
}

export default Homepage;