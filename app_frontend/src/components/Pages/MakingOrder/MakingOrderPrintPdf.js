export default {
  computed: {
    headerList: function () {
      return function (val) {
        let headerArray = [];
        for (let key in val) {
          let headerCol = {
            "text": val[key].text,
            "alignment": "center"
          };
          headerArray.push(headerCol);
        }
        return headerArray;
      }
    }
  },
  methods: {
    // 日付変換
    changeISODateUS (val) {
      let arrDate = val.split("-");
      return arrDate[1] + "/" + arrDate[2] + "/" + arrDate[0]
    },
    // JS日付フォーマット関数(US表記)
    changeDateUS(dt){
      let y = dt.getFullYear();
      let m = ("00" + (dt.getMonth()+1)).slice(-2);
      let d = ("00" + dt.getDate()).slice(-2);
      return m + "/" + d + "/" + y;
    },
    async print() {
      let val = this.createData();
      console.log(val);

      // エラー処理
      if(val.error.length > 0) {
        // エラーコードを表示
        if (
          await this.$refs.confirm.open(
            "Error",
            val.error[0],
            { color: "red" }
          )
        ) {}        
      } else {
        // エラーがない場合はPDF作成
        this.printPDF(val);
        // 発注書印刷フラグ立て
        if(!this.reprint){
          // 日付取得
          let dt = new Date();
          let year = dt.getFullYear();
          //1月が0、12月が11。そのため+1をする。
          let month = dt.getMonth()+1;
          let date = dt.getDate();
          let today = year + "-" + month + "-" + date;

          // 更新用データセットの作成
          let updateData = {
            printedParts: val.printedParts,
            today: today
          };
          // 仕入れファイルの作成
          await this.createReceivingProcesses(updateData);
          // 更新処理
          await this.updateIsPrinted(updateData);
          // データの再読込
          this.loadData();
        }
      }
    },
    // 仕入れファイルの作成
    async createReceivingProcesses(val) {
      let partsList = val.printedParts;
      // 仕入れファイルの作成
      for(let p in partsList) {
        let receivingProcess = {};
        receivingProcess.order = partsList[p].id;
        receivingProcess.unit = partsList[p].unit;
        receivingProcess.currency = partsList[p].currency;
        receivingProcess.rate = partsList[p].rate;
        receivingProcess.createdBy = this.loginUserData.id;
        receivingProcess.modifiedBy = this.loginUserData.id;
        await this.postReceivingProcess(receivingProcess);
      }
    },
    // 印刷済みステータスの反映
    async updateIsPrinted(val) {
      let partsList = val.printedParts;

      // 編集ステータスの変更
      for(let p in partsList) {
        partsList[p].isPrinted = true;
        partsList[p].orderedDate = val.today;
        partsList[p].modifiedBy = this.loginUserData.id;
        if(this.hasMFGNo) {
          partsList[p].billOfMaterialId = partsList[p].billOfMaterial.id;
        } else {
          partsList[p].billOfMaterialId = null;
        }
        await this.putMakingOrder(partsList[p]);
      }
    },
    // PDF用データ作成
    createData() {
      // PDF表示名称の定義
      let pdfTitle = this.switchParams.cardTitle.replace(/\s+/g, "");

      // 印刷用コンテンツの定義
      let content = this.createContent();
      // タイトルの追加
      content.headerText = pdfTitle;
      // ヘッダーの追加
      content.header = this.poHeader();
      content.pageMargins = [30,300,30,0];
      content.styles = {
        title: { fontSize: 20},
        titleSub: { fontSize: 13},
        poTitle: { fontSize: 15, bold: true},
        mdText: { fontSize: 9,},
        titleDate: { fontSize: 14, alignment: 'right', bold: true},
      };

      return content;
    },
    createContent: function () {
      // 部品データを取得
      let selectedData = this.selectedItems;
      // エラー格納用リストの定義
      let error = [];
      // 印刷用部品データ
      let printedParts = [];
      // 印刷用テーブルデータ作成
      let contentList = [];
      // 通貨リスト定義
      let currency = [];
      for (let key in selectedData) {
        if (selectedData[key].selected) {
          if (selectedData[key].selected.length) {
            // テーブルヘッダー設定
            let tablebody = [];
            // 部品種別ごとにテーブルヘッダーを取得
            let tableHeaderData = this.headerData(selectedData[key].isProcessed);
            // PDF用にテーブルヘッダーデータを編集
            let tableHeader = this.headerList(tableHeaderData);
            // テーブルに追加
            tablebody.push(tableHeader);
            // 部品データの入力
            // 部品個数をゼロとして定義(カウント用)
            let partsAmount = 0;
            let orderAmount = 0;
            for (let p in selectedData[key].selected) {
              // 印刷部品リストを入力
              printedParts.push(selectedData[key].selected[p]);
              // 部品個数をカウント
              partsAmount += 1;
              // 部品金額を合計
              orderAmount += Math.round(selectedData[key].selected[p].totalPrice * 100) / 100;
              orderAmount = Math.round(orderAmount * 100) / 100;
              // 部品挿入行の定義
              let partRow = [];
              currency.push(selectedData[key].selected[p]["currencyData"].display);
              // ヘッダーを参照して各カラムのデータを入力する
              for (let h in tableHeaderData) {
                let d = selectedData[key].selected[p][tableHeaderData[h].value];
                // 日付の変換
                if (tableHeaderData[h].value === "desiredDeliveryDate") {
                  if (d) {
                    d = this.changeISODateUS(d);
                  }
                }
                // 発注番号を文字列に変換
                if (h === 0) d = String(d);
                // データがネストしている場合はネスと先データを表示
                if (tableHeaderData[h].nest) {
                  if (d) {
                    d = d[tableHeaderData[h].nest];
                  }
                }
                // データが右寄せ(数値)の場合は右寄せ処理
                if (tableHeaderData[h].class === "text-xs-right") {
                  d = {"text": d, alignment: "right"}
                }
                // データが未定義の場合はblankを入力
                if (!d) {
                  d = "";
                }
                // 最後の項目では空白を入力
                partRow.push(d);
              }
              // テーブルに行を追加
              tablebody.push(partRow);
            }
            // 合計金額計算
            let totalPrice = orderAmount.toFixed(2).toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g, '$1,');
            let total_display = "";

            // 複数種別の通貨があった場合はエラーフラグを立てる
            let currencyDuplication = currency.filter(function (x, i, self) {
              return self.indexOf(x) === i;
            });
            // 複数通貨の存在チェック
            if (currencyDuplication.length > 1) {
              // 複数の通貨がある場合はエラーフラグを立てる
              let errorMsg = "Multiple currencies are checked. Please select only one currency";
              error.push(errorMsg);
            } else {
              // 単一通貨の場合は場合は合計金額に通貨記号を追加
              total_display = currencyDuplication[0] + " " + totalPrice;
            }
            // 部品種別ごとのテーブル幅定義
            let tableWidths = [];
            let colSpan = 0;
            let totalRow = [];
            if (selectedData[key].isProcessed) {
              tableWidths = [15, 60, 60, 110, 40, 30, 60, 60, 40];
              colSpan = 7;
              // 合計金額行を追加
              totalRow = [
                {colSpan: colSpan, text: "Total : ", alignment: "right"}, '', '', '', '', '', '',
                {colSpan: 2, text: total_display, alignment: "right", bold: true}, ''
              ]
            } else {
              tableWidths = [15, 90, 60, 130, 30, 60, 60, 40];
              colSpan = 6;
              // 合計金額行を追加
              totalRow = [
                {colSpan: colSpan, text: "Total : ", alignment: "right"}, '', '', '', '', '',
                {colSpan: 2, text: total_display, alignment: "right", bold: true}, ''
              ]
            }
            // 行を挿入
            tablebody.push(totalRow);

            // テーブル作成
            let tableData = {
              table: {
                headerRows: 1,
                widths: tableWidths,
                body: tablebody
              }
            };
            contentList.push(tableData);
            // 合計個数の表示
            let itemAmount = "Total " + partsAmount + " items";
            contentList.push({"text": itemAmount, "alignment": "right"});

            // フッターの挿入
            contentList.push(this.poFooter());

            let nextKey = Number(key) + 1;
            // 最終ページ以外で改ページ
            if (selectedData[nextKey]) {
              if (selectedData[nextKey].selected) {
                // console.log(selectedData[nextKey].selected);
                if (selectedData[nextKey].selected.length) {
                  contentList.push({text: '', pageBreak: 'after'});
                }
              }
            }
          }
        }
      }
      // データを出力
      return {
        content: contentList,
        error: error,
        printedParts: printedParts
      }
    },
    poFooter: function () {
      const user = this.loginUserData;
      // POフッター部分
      return [
        {
          dontBreakRows: true,
          margin: [0, 30, 0, 0],
          table: {
            headerRows: 0,
            widths: [250],
            margin: [0, 50, 0, 0],
            body: [
              [{text: "Created by : " + user["fullname"], bold: true, fontSize: 12}],
              [{text: "Approved by :", bold: true, fontSize: 12}],
              [{text: "Signature :", bold: true, fontSize: 12}],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === node.table.headerRows) ? 0 : 1;
            },
            vLineWidth: function (i) {
              return 0;
            },
          },
        },
        {
          margin: [0, 20, 0, 0],
          table: {
            headerRows: 0,
            widths: [300],
            body: [
              [{text: "Note: "}],
              [{text: "  "}],
              [{text: "  "}],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 0;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 0;
            },
          }
        },
      ]
    },
    poHeader() {
      const supplier = this.userPartner;
      const company = this.userCompany;
      const jobOrder = this.jobOrder;
      let mfgNo = "";

      // 工事番号の設定
      if(this.hasMFGNo) {
        mfgNo = jobOrder.mfgNo;
        // 関係会社工事番号のチェックおよび表示
        if(supplier["isRelatedParty"] && jobOrder["relatedPartyMfgNo"] !== "") {
          mfgNo = mfgNo + " / " + jobOrder["relatedPartyMfgNo"];
        }
      }
      // 日付の設定
      let today = this.changeDateUS(new Date());

      // ヘッダー
      return [
        {
          columns: [
            { image: company["logoData"], width: 100, margin: [ 0, 0, 0, 0 ] },
            [
              {text: company.name, style: 'title', width: '*', margin: [ 20, 0, 0, 0 ]},
              {text: company.address, style: 'titleSub', width: '*', margin: [ 20, 0, 0, 0 ]},
              {text: 'TEL : ' + company.phone + ' FAX : ' + company["fax"] , style: 'titleSub', width: '*', margin: [ 20, 0, 0, 0 ]},
            ],
          ],
          margin: [ 30, 40, 30, 0 ],
        },
        {
          columns: [
            { text: "Purchase Order", style: 'poTitle', alignment: "center", margin: [ 0, 20, 0, 20 ], decoration: 'underline' }
          ],
          margin: [ 30, 0, 30, 0 ],
        },
        {
          columns: [
            {
              table: {
                headerRows: 0,
                widths: [ 120, 150 ],
                margin: [ 0, 20, 0, 0 ],
                body: [
                  [ {text:"Order recipient:", style: 'mdText' }, {text:supplier.name, style: 'mdText' }],
                  [ {text:"Phone : ", style: 'mdText' }, {text:supplier.phone, style: 'mdText' } ],
                  [ {text:"Fax : ", style: 'mdText' }, {text:supplier["fax"], style: 'mdText' } ],
                  [ {text:"Manufacturing number : ", style: 'mdText' }, {text:mfgNo, style: 'mdText' } ],
                ]
              },
              layout: {
                hLineWidth: function (i, node) {
                  return (i === node.table.headerRows) ? 0 : 0.5;
                },
                vLineWidth: function () {
                  return 0;
                },
              },
            },
            [
              {
                columns: [
                  {
                    text:'',
                    width: '*'
                  },
                  {
                    table: {
                      body: [
                        [{text:'Date : ' + today, style: 'mdText' } ],
                        [{text: company.name, style: 'mdText' } ],
                        [{text:'Phone : ' + company.phone, style: 'mdText' } ],
                        [{text:'Fax : ' + company["fax"], style: 'mdText' } ],
                      ]
                    },
                    margin: [ 0, 0, 40, 0 ],
                    width: 'auto', // Changes width of the table
                    layout: 'noBorders'
                  }
                ]
              }
            ]
          ],
          margin: [ 30, 0, 30, 0 ],
        },
      ];
    }
  }
}