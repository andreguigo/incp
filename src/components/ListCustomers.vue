<template>
    <div class="container-fluid p-4">
        <h2>Lista de Voluntários</h2>

        <input
            v-model="search"
            type="text"
            placeholder="Buscar..."
            class="form-control mb-3"
        />
        {{ filteredCustomers.length }} voluntários encontrados.

        <hr />
    
        <div class="table-responsive small">
            <table class="table table-striped table-sm align-middle">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">&nbsp;</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Idade</th>
                        <th scope="col">Área(s) escolhida</th>
                        <th scope="col">Membro desde...</th>
                        <th scope="col">Visualizar</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider"> 
                    <tr v-for="(customer, index) in paginatedCustomers" :key="customer.id"  @click="openModal(customer.id)">
                        <th scope="row">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</th>
                        <th scope="row">
                            <div class="avatar-tb">
                                <img 
                                    :src="customer.fileNameUrl" 
                                    :alt="'Foto de perfil de ' + customer.fullName" 
                                    class="rounded"
                                    width="96"
                                />
                            </div></th>
                        <td>{{ firstUpperCase(customer.fullName) }}</td>
                        <td>{{ customerAge(customer.birthDate) }}</td>
                        <td>{{ firstUpperCase(customer.selectedVolunteerArea) }}</td>
                        <td>{{ customer.selectedMemberDate }}</td>
                        <td><button class="btn btn-lg"><i class="bi bi-folder2-open"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <nav class="mt-3">
            <ul class="pagination">

                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="previousPage">Anterior</button>
                </li>

                <li 
                    v-for="page in pageNumbers"
                    :key="page"
                    class="page-item"
                    :class="{ active: currentPage === page }"
                >
                    <button class="page-link" @click="goToPage(page)">
                        {{ page }}
                    </button>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === pageNumbers }">
                    <button class="page-link" @click="nextPage">Próxima</button>
                </li>

            </ul>
        </nav>

        <!-- Modal -->
        <div class="modal fade" id="customerModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content rounded-4 shadow">
                    <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body mb-4">
                        <div class=" image d-flex flex-column justify-content-center align-items-center"> 
                            <div class="avatar">
                                <img 
                                    :src="customerProfile.fileNameUrl" 
                                    :alt="'Foto de perfil de ' + customerProfile.fullName" 
                                    class="rounded"
                                    width="128"
                                />
                            </div>
                            <h2>{{ firstUpperCase(customerProfile.fullName) }}</h2>
                            <p class="lead">{{ firstUpperCase( customerProfile.selectedVolunteerArea ) }}</p>

                            <div class="info d-flex flex-column justify-content-center align-items-start">
                                <h4>Bio:</h4>
                                <p>{{ firstUpperCase(customerProfile.fullName).split(' ')[0] }} tem {{ customerAge(customerProfile.birthDate) }} anos e é membro desde {{ customerProfile.selectedMemberDate }}.</p>
                                
                                <h4>Foi batizada em:</h4>
                                <p>{{ formatDate(customerProfile.baptismDate) }}</p>

                                <h4>Contato:</h4>
                                <a class="btn" :href="'https://wa.me/' + sanitizePhone(customerProfile.phoneCustomer)" target="_blank"><i class="bi bi-whatsapp"></i> falar no Whatsapp</a>
                                <a class="btn" :href="'tel:' + sanitizePhone(customerProfile.phoneCustomer)" target="_blank"><i class="bi bi-telephone-outbound"></i> ligar </a>
                            </div>
                        </div>                         
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { useCustomerStore } from '@/stores/customers';
import { useDateUtil } from '@/utils/dateCasesUtil';
import { useStringCaseUtil } from '@/utils/stringCasesUtil';

export default {
    name: 'ListCustomers',
    data() {
        return {
            search: "",
            listCustomers: [],
            customerProfile: [],
            itemsPerPage: 10,
            currentPage: 1
        };
    },
    created() {
        this.fetchCustomers();
    },
    computed: {
        filteredCustomers() {
            if (!Array.isArray(this.listCustomers)) return [];

            const term = this.search.toLowerCase();

            return this.listCustomers.filter(row =>
                Object.values(row).some(value => 
                    String(value).toLowerCase().includes(term)
                )
            );
        },

        pageNumbers() {
            const totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
            
            if (totalPages <= 7) {
                return Array.from({ length: totalPages }, (_, i) => i + 1);
            }
            
            const current = this.currentPage;
            const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
            
            return pages
                .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    page >= totalPages - 1 ||
                    Math.abs(page - current) <= 1
                )
                .reduce((acc, page, i, arr) => {
                    if (i > 0 && page - arr[i - 1] > 1) {
                        acc.push('...');
                    }
                    acc.push(page);
                    return acc;
                }, []);
        },

        paginatedCustomers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredCustomers.slice(start, end);
        }
    },
    methods: {
        async fetchCustomers() {
            const customerStore = useCustomerStore();
            await customerStore.fetchCustomers();
            this.listCustomers = customerStore.customers;
        },

        async fetchCustomerById(id) {
            const customerStore = useCustomerStore();
            await customerStore.fetchCustomerById(id);

            this.customerProfile = customerStore.currentCustomer;
        },

        goToPage(page) {
            this.currentPage = page;
        },

        nextPage() {
            if (this.currentPage < this.pageNumbers) {
                this.currentPage++;
            }
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        openModal(id) {
            this.fetchCustomerById(id);

            const modal = new Modal(document.getElementById('customerModal'));
            modal.show();
        },

        firstUpperCase(value) {
            return useStringCaseUtil().firstUpperCase(value);
        },

        customerAge(dateBirth) {
            return useDateUtil().customerAge(dateBirth);
        },

        sanitizePhone(value) {
            if (!value) return "";

            return value.toString().replace(/\D/g, '');
        },

        formatDate(isoDate) {
            return useDateUtil().formatDate(isoDate);
        }
    },

    watch: {
        search() {
            this.currentPage = 1;
        }
    }
};
</script>

<style scoped>
    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
    }
    .avatar-tb {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
    }
    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>