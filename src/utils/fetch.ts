import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchData = (dataUrl: string) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    console.log('hook', dataUrl);
    useEffect(() => {
        console.log('wtffff', dataUrl);
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: response } = await axios.get(dataUrl);
                setData(response);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return {
        data,
        loading,
    };
};
