<template>
    <div class="container-fluid p-4">
        <h2>Lista de Voluntários</h2>

        <input
            v-model="search"
            type="text"
            placeholder="Buscar..."
            class="form-control mb-3"
        />
        {{ filteredUsers.length }} voluntários encontrados.

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
                    <tr v-for="(user, index) in paginatedUsers" :key="user.id"  @click="openModal(user.id)">
                        <th scope="row">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</th>
                        <th scope="row">
                            <div class="avatar-tb">
                                <img 
                                    :src="baseUrl + user.fileName" 
                                    :alt="'Foto de perfil de ' + user.fullName" 
                                    class="rounded"
                                    width="96"
                                />
                            </div></th>
                        <td>{{ firstUpperCase(user.fullName) }}</td>
                        <td>{{ user.birthDate }}</td>
                        <td>{{ firstUpperCase(user.selectedVolunteerArea) }}</td>
                        <td>{{ user.selectedMemberDate }}</td>
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
                    v-for="page in totalPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: currentPage === page }"
                >
                    <button class="page-link" @click="goToPage(page)">
                        {{ page }}
                    </button>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="nextPage">Próxima</button>
                </li>

            </ul>
        </nav>

        <!-- Modal -->
        <div class="modal fade" id="userModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content rounded-4 shadow">
                    <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body mb-4">
                        <div class=" image d-flex flex-column justify-content-center align-items-center"> 
                            <div class="avatar">
                                <img 
                                            :src="baseUrl + userProfile.fileName" 
                                            :alt="'Foto de perfil de ' + userProfile.fullName" 
                                            class="rounded"
                                            width="128"
                                        />
                            </div>
                            <h2>{{ firstUpperCase(userProfile.fullName) }}</h2>
                            <p class="lead">{{ firstUpperCase( userProfile.selectedVolunteerArea ) }}</p>

                            <div class="info d-flex flex-column justify-content-center align-items-start">
                                <h4>Bio:</h4>
                                <p>{{ firstUpperCase(userProfile.fullName).split(' ')[0] }} tem {{ userProfile.birthDate }} anos e é membro desde {{ userProfile.selectedMemberDate }}.</p>
                                
                                <h4>Foi batizada em:</h4>
                                <p>{{ userProfile.baptismDate }}</p>

                                <h4>Contato:</h4>
                                <a class="btn" :href="'https://wa.me/' + sanitizePhone(userProfile.phone)" target="_blank"><i class="bi bi-whatsapp"></i> falar no Whatsapp</a>
                                <a class="btn" :href="'tel:' + sanitizePhone(userProfile.phone)" target="_blank"><i class="bi bi-telephone-outbound"></i> ligar </a>
                            </div>
                        </div>                         
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
export default {
    name: 'ListUsers',
    data() {
        return {
            search: "",
            myListUsers: [],
            userProfile: [],
            baseUrl: import.meta.env.VITE_API_IMG_URL,
            itemsPerPage: 5,
            currentPage: 1
        };
    },
    created() {
        this.listUsers();
    },
    computed: {
        filteredUsers() {
            if (!Array.isArray(this.myListUsers)) return [];

            const term = this.search.toLowerCase();

            return this.myListUsers.filter(row => 
                Object.values(row).some(value => 
                    String(value).toLowerCase().includes(term)
                )
            );
        },

        totalPages() {
            return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        },

        paginatedUsers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredUsers.slice(start, end);
        }
    },
    methods: {
        listUsers() {
            axios.get('http://localhost:3000/api')
                .then(response => { 
                    this.myListUsers = response.data 
                })
                .catch(error => {
                    console.error('Erro ao listar usuários:', error);
                });
        },

        userOnly(identifier) {
            axios.get('http://localhost:3000/api/' + identifier)
                .then(response => { 
                    this.userProfile = response.data;
                })
                .catch(error => {
                    console.error('Erro ao listar usuários:', error);
                });
        },

        goToPage(page) {
            this.currentPage = page;
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        openModal(identifier) {
            this.userOnly(identifier);

            const modal = new Modal(document.getElementById('userModal'));
            modal.show();
        },

        firstUpperCase(value) {
           if (!value) return "";

            return value
                .split(',')
                .map(item => {
                    return item
                        .trim() 
                        .split(/\s+/)
                        .map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        )
                        .join(' ');
                })
                .join(', '); 
        },

        sanitizePhone(value) {
            if (!value) return "";

            return value.toString().replace(/\D/g, '');
        },

        recurrency() {
            const count = (json, word) =>
            json.reduce((acc, el) => acc + el.selectedVolunteerArea.split(',').filter(a => a.trim().toLowerCase() === word).length, 0);

            console.log(count(this.myListUsers, "kids"));
            console.log(count(this.myListUsers, "logística"));
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