import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(3, 0, 3)
    },
    controls: {
        display: 'flex',
        gap: '8px'
    }
}));

type CSVFileImportProps = {
    url: string;
    title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
    const classes = useStyles();
    const [file, setFile] = useState<any>();
    const [isSuccessToastOpened, setIsSuccessToastOpened] = useState(false);
    const [isErrorToastOpened, setIsErrorToastOpened] = useState(false);
    const [isUploadInProgress, setIsUploadInProgress] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    const onFileChange = (e: any) => {
        console.log(e);
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        setFile(files.item(0));
    };

    const removeFile = () => {
        setFile('');
    };

    const uploadFile = async (e: any) => {
        setIsUploadInProgress(true);
        try {
            const response = await axios({
                headers: {
                    Authorization: `Basic ${localStorage.getItem(
                        'authorization_token'
                    )}`
                },
                method: 'GET',
                url,
                params: {
                    name: encodeURIComponent(file.name)
                }
            });
            await fetch(response.data, {
                method: 'PUT',
                body: file
            });
            setIsSuccessToastOpened(true);
        } catch (err) {
            setIsErrorToastOpened(true);
        } finally {
            setIsUploadInProgress(false);
        }

        setFile('');
    };

    return (
        <div className={classes.content}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <div className={classes.controls}>
                {!file ? (
                    <>
                        <Button
                            onClick={() => fileInput?.current?.click()}
                            variant="contained"
                            color="primary"
                            size="small"
                        >
                            Choose file
                        </Button>
                        <input
                            style={{ display: 'none' }}
                            onChange={onFileChange}
                            type="file"
                            ref={fileInput}
                        />
                    </>
                ) : (
                    <>
                        <Button
                            onClick={uploadFile}
                            variant="contained"
                            color="primary"
                            size="small"
                        >
                            {isUploadInProgress
                                ? 'Uploading...'
                                : 'Upload file'}
                        </Button>
                        <Button
                            onClick={removeFile}
                            variant="contained"
                            color="secondary"
                            size="small"
                        >
                            Remove file
                        </Button>
                    </>
                )}
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    component={Link}
                    to={'/admin/product-form/'}
                >
                    create product
                </Button>
            </div>
            <Snackbar
                onClose={() => setIsSuccessToastOpened(false)}
                open={isSuccessToastOpened}
                autoHideDuration={5000}
            >
                <Alert severity="success">
                    File imported and parsed successfully.
                </Alert>
            </Snackbar>
            <Snackbar
                onClose={() => setIsErrorToastOpened(false)}
                open={isErrorToastOpened}
                autoHideDuration={5000}
            >
                <Alert severity="error">Failed to upload file.</Alert>
            </Snackbar>
        </div>
    );
}
