import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchData = (dataUrl: string) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
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
    }, [dataUrl]);

    return {
        data,
        loading,
    };
};
