var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];
// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}
$(function () {
    loadBookData();
});
//新增書籍畫面
$("#add_book").click(function () {
    var add_window = $("#window"),
        undo = $("#add_book");

    undo.click(function () {
        add_window.data("kendoWindow").open();
        undo.fadeOut();
    });

    function onClose() {
        undo.fadeIn();
    }

    add_window.kendoWindow({
        width: 800,
        title: "新增書籍",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        close: onClose
    }).data("kendoWindow").center().open();
});

//換圖片
$(document).ready(function () {
    $("#book_category").change(function () {
        $(".book-image").attr("src", "image/" + $('#book_category').val() + ".jpg");
    });
});


$(document).ready(function () {
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            pageSize: 20
        },
        height: 550,
        scrollable: true,
        sortable: true,/*允許排序*/
        filterable: false,
        pageable: {
            input: true,
            numeric: false,/*跳轉頁面按鈕*/
            messages: {
                page: "頁",
                of: "共 {0}",
                display: "顯示條目 {0}-{1} 共 {2}"
            }
        },
        toolbar: kendo.template($("#template").html()),
        columns: [
            { command: [{ click: delete_book, text: "刪除" }], width: 21 },
            { field: "BookId", title: "書籍<br>編號", width: 15 },
            { field: "BookName", title: "書籍<br>名稱", width: 45 },
            { field: "BookCategory", title: "書籍<br>種類", values: bookCategoryList/*書籍種類顯示中文*/, css: "right-align", width: 20 },
            { field: "BookAuthor", title: "作者", width: 25 },
            { field: "BookBoughtDate", title: "購買<br>日期", width: 15, format: "{0:yyyy-MM-dd}" },
            { field: "BookDeliveredDate", title: "送達<br>狀態", width: 15 },
            { field: "BookPrice", title: "金額", width: 15, format: "{0:N0}"/*千分位*/, attributes: { "class": "right-align", style: "text-align: right" }/*靠右顯示*/ },
            { field: "BookAmount", title: "數量", width: 15, format: "{0:N0}", attributes: { "class": "right-align", style: "text-align: right" } },
            { field: "BookTotal", title: "總計", width: 20, format: "{0:N0}元", attributes: { "class": "right-align", style: "text-align: right" } }
        ]
    });
    $("#search_book").keyup(function () {   /*連動式查詢 */
        var val = $('#search_book').val();
        $("#book_grid").data("kendoGrid").dataSource.filter({
            logic: "or",
            filters: [
                {
                    field: "BookName",
                    operator: "contains",
                    value: val
                },
                {
                    field: "BookAuthor",
                    operator: "contains",
                    value: val
                }
            ]
        });
    });
});

//刪除書籍 未寫入bookDataFromLocalStorage
function delete_book(x) {
    x.preventDefault();
    var bookdel = this.dataItem($(x.target).closest("tr"));
    var dataSource = $("#book_grid").data("kendoGrid").dataSource;
    kendo.confirm("確定刪除「" + bookdel.BookName + "」 嗎?").then(function () {
        dataSource.remove(bookdel);
    });
};

