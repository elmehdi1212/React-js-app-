import axios from 'axios';

export class GeolocalisationService {

    

    getUsers() {
        return axios.get('http://localhost:8080/users/all')
               
    }

    getFriends(id) {
        return axios.get('http://localhost:8080/users/findFriends/'+id)
        
                
    }
    getPositionsBetweenTwoDates(id,date1,date2) {
        return axios.get('http://localhost:8080/positions/userPositionsBetweenTwoDates/'+id+'/'+date1+'/'+date2)
        
                
    }
    getLastPositions(id) {
        return axios.get('http://localhost:8080/positions/user/'+id)
        
                
    }

    getCustomers(params) {
        return axios.get('http://localhost:8080/users/all',{params: params})
                .then(res => res.data)
    }
}