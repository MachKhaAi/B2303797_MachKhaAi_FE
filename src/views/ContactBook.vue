<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";

export default {
    components: {
        ContactCard,
        InputSearch,
        ContactList,
    },
    data() {
        return {
            searchText: "",
            contacts: [],
            activeIndex: -1,
        };
    },
    watch: {
        // Giám sát thay đổi từ ô tìm kiếm và bỏ chọn liên hệ đang được chọn
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        // Ghép các trường dữ liệu thành chuỗi để tiện lọc
        contactStrings() {
            return this.contacts.map((contact) => {
                const { name, email, address, phone } = contact;
                return [name, email, address, phone].join("").toLowerCase();
            });
        },
        // Trả về contact có chứa thông tin cần tìm kiếm
        filteredContacts() {
            if (!this.searchText) return this.contacts;
            // SỬA: Thêm .toLowerCase() cho searchText để tìm kiếm không phân biệt hoa thường
            return this.contacts.filter((_contact, index) => {
                return this.contactStrings[index].includes(this.searchText.toLowerCase());
            });
        },
        // Lấy liên hệ đang được chọn
        activeContact() {
            if (this.activeIndex < 0) return null;
            return this.filteredContacts[this.activeIndex];
        },
        // Tổng số liên hệ khớp với từ khóa tìm kiếm
        filteredContactsCount() {
            return this.filteredContacts.length;
        },
    }, // Kết thúc computed

    // --- SỬA: Đã xóa dấu }, thừa ở đây để nối liền methods vào export default ---

    methods: {
        async retrieveContacts() {
            try {
                this.contacts = await ContactService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveContacts();
            this.activeIndex = -1;
        },
        async removeAllContacts() {
            if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
                try {
                    await ContactService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        goToAddContact() {
            this.$router.push({ name: "contact.add" });
        },
    },
    mounted() {
        this.retrieveContacts();
    },
};
</script>

<template>
    <div class="page row">
        <div class="col-md-10">
            <InputSearch v-model="searchText"/>
        </div>
        <div class="mt-3 col-md-6">
            <h4>Danh bạ
                <i class="fas fa-address-book"></i>
            </h4>
            <ContactList
                v-if="filteredContactsCount > 0"
                :contacts="filteredContacts"
                v-model:activeIndex="activeIndex"
            />
            <p v-else>Không có liên hệ nào.</p>

            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    <i class="fas fa-redo"></i>Làm mới
                </button>
                
                <button class="btn btn-sm btn-success" @click="goToAddContact">
                    <i class="fas fa-plus"></i>Thêm mới
                </button>

                <button class="btn btn-sm btn-danger" @click="removeAllContacts">
                    <i class="fas fa-trash"></i>Xóa tất cả
                </button>
            </div>
        </div>
        <div class="mt-3 col-md-6">
            <div v-if="activeContact">
                <h4>
                    Chi tiết liên hệ
                    <i class="fas fa-id-card"></i>
                </h4>
                <ContactCard :contact="activeContact"/>
                <router-link
                    :to="{
                        name: 'contact.edit',
                        params: { id: activeContact._id},
                    }"
                >
                    <span class="mt-2 badge badge-warning">
                        <i class="fas fa-edit"></i>Hiệu chỉnh</span>
                    </router-link>
            </div>
        </div>
    </div>
</template>

<style scope>
    .page {
        text-align: left;
        max-width: 750;
    }
</style>
