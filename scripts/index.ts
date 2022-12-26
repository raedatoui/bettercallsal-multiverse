import { loadSites } from './parser';

const run = async () => {
    await loadSites();
    // const response = await axios({
    //     method: 'get',
    //     url: 'https://collectionapi.metmuseum.org/public/collection/v1/objects/82443',
    //
    //     // responseEncoding: 'utf-8',
    //     // responseType: 'json',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // });
    //
    // console.log(response.data);
};

run()
    .then(() => {
        process.exit();
    })
    .catch((err) => {
        console.log(err);
        console.log(JSON.stringify(err));
        process.exit();
    });
