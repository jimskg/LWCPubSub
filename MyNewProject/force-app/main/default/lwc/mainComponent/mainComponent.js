import { LightningElement, track, wire } from 'lwc';
import getData from '@salesforce/apex/FindAccCont.findAccAndContacts';


export default class LightningExampleInputSearch extends LightningElement {
    @track searchKey='';
    @track error;
    @track account;

    
    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch(){
        console.log(this.searchKey);
        getData({ searchAccount: this.searchKey })
            .then(result => {
                this.account = result;
                this.error = undefined;
                console.log(this.account);
                console.log(result);
                
            })
            .catch(error => {
                this.account = undefined;
                this.error = error;
                console.log(error);
            });
    }
}
