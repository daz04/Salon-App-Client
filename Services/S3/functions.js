import axios from 'axios'


export const getPutClientProfilePicUrl = (clientId, callback) => {
    axios.get(`http://s3serve-env.eba-tnn9thma.us-east-1.elasticbeanstalk.com/clientImageUrl?clientId=${clientId}`).then(response=> {
        callback(response)
       
        }).catch(err=> {
            console.log("GET CLIENT PROFILE PIC URL FAILED")
            console.log(err)
            callback(null)
    })
}

export const fetchClientProfilePicUrl = (clientId, callback) => {
    axios.get(`http://s3serve-env.eba-tnn9thma.us-east-1.elasticbeanstalk.com/fetchClientprofilepic?clientId=${clientId}`).then(response=> {
        callback(response)
       
        }).catch(err=> {
            console.log("GET CLIENT PROFILE PIC FAILED")
            console.log(err)
            callback(null)
    })

}