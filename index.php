<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>受注管理【モジュール分割・左メニュー版】</title>
  <link rel="stylesheet" href="assets/css/styles.css">
  <link rel="icon" href="favicon.ico">
</head>
<body>
<div class="app">
  <aside class="menu" aria-label="サイドメニュー">
    <nav>
      <div class="menu-heading">受注管理</div>
      <div class="menu-list">
        <a class="menu-link" href="#">受注統計</a>
        <a class="menu-link active" href="#">受注入力</a>
        <a class="menu-link" href="#">受注一覧</a>
        <a class="menu-link" href="#">請求書発行</a>
      </div>
      <div class="menu-heading">システム設定</div>
      <div class="menu-list">
        <a class="menu-link" href="#">ユーザー登録</a>
        <a class="menu-link" href="#">ユーザー一覧</a>
        <a class="menu-link" href="#">アクセス登録</a>
      </div>
      <div class="menu-heading">勤怠管理</div>
      <div class="menu-list">
        <a class="menu-link" href="#">勤怠一覧</a>
      </div>
      <div class="menu-heading">ツール</div>
      <div class="menu-list">
        <a class="menu-link" href="#">バンプラン</a>
        <a class="menu-link" href="#">パレッタイズ</a>
      </div>
    </nav>
  </aside>

  <main class="content">
    <div class="order-toolbar card" style="padding:10px">
      <div class="inline">
        <input placeholder="顧客ID / 顧客名検索" style="min-width:260px;border:1px solid #d1d5da;border-radius:10px;padding:6px 10px">
        <button class="btn small" data-action="新規採番">新規採番</button>
        <button class="btn small" data-action="過去案件呼出し">過去案件呼出し</button>
        <button class="btn small" data-action="内容流用して新規採番">内容流用で新規採番</button>
        <button class="btn small" data-action="案件保存">案件保存</button>
      </div>
      <div class="actions">
        <button class="btn small" data-action="PDF:ケースマーク">ケースマークPDF</button>
        <button class="btn small" data-action="PDF:梱包明細">梱包明細PDF</button>
        <button class="btn small" data-action="PDF:売上子伝票">売上子伝票PDF</button>
        <button class="btn small" data-action="PDF:出荷伝票">出荷伝票PDF</button>
      </div>
    </div>

    <div class="card" style="margin-top:10px">
      <div class="tab-nav" id="main-tabs">
        <button class="tab-btn active" data-target="panel-order">受注情報</button>
        <button class="tab-btn" data-target="panel-casemark">ケースマーク設計</button>
      </div>

      <!-- 受注情報 -->
      <div id="panel-order" class="panel active">
        <div class="bd order-upper">
          <!-- 基本情報 -->
          <div class="card upper-card basic-card">
            <div class="hd">
              <div class="ttl">基本情報</div>
              <div class="seg" id="bi-tabs"><button class="active" data-t="fields">項目</button><button data-t="pack">梱包指示</button></div>
            </div>
            <div class="bd">
              <div class="basic-grid">
                <!-- fields panel -->
                <div class="basic-col" data-bi-panel="fields">
                  <div class="group-ttl">顧客・連絡</div>
                  <div class="row"><label>担当者</label><input value="冨田"></div>
                  <div class="row"><label>客注コード</label><input placeholder="例：1024-23"></div>
                  <div class="row"><label>納品先</label><select><option>P.U</option></select></div>
                  <div class="row"><label>電話番号</label><input placeholder="-- ---- ----"></div>
                  <div class="row"><label>住所1</label><input placeholder="都道府県 市区町村 番地 建物名等"></div>
                  <div class="row"><label>住所2</label><input placeholder="建物名・部署・担当など（任意）"></div>
                </div>

                <div class="basic-col" data-bi-panel="fields">
                  <div class="group-ttl">案件・船積</div>
                  <div class="row"><label>荷主</label><input></div>
                  <div class="row"><label>船名</label><input></div>
                  <div class="row"><label>出港日</label><input type="date"></div>
                  <div class="row"><label>受注日</label><input type="date"></div>
                  <div class="row"><label>発行日</label><input type="date"></div>
                </div>

                <div class="basic-col" data-bi-panel="fields">
                  <div class="group-ttl">納期・管理</div>
                  <div class="row"><label>東新搬入日</label><input type="date"></div>
                  <div class="row"><label>納期</label><input type="date"></div>
                  <div class="row"><label>売上日</label><input type="date"></div>
                  <div class="row"><label>更新日</label><input value="自動入力" readonly></div>
                  <div class="row"><label>更新者</label><input value="demo01" readonly></div>
                  <div class="row"><label>更新ロック</label><button id="lockBtn" class="btn small" aria-pressed="false">未確定</button></div>
                </div>

                <!-- pack panel -->
                <div class="basic-col bi-panel" data-bi-panel="pack" style="grid-column: 1 / -1; display:none">
                  <div class="group-ttl">梱包指示</div>
                  <textarea id="packInstr" style="width:100%;min-height:260px;border:1px solid #d1d5da;border-radius:10px;padding:10px" placeholder="梱包方法・注意点、現地要件、工程メモなど"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- プレビュー -->
          <div class="card upper-card preview-card">
            <div class="hd"><div class="ttl">ケースマークプレビュー</div></div>
            <div class="bd">
              <div class="mini-frame">
                <svg id="mini-svg" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" width="277" height="190" class="page"></rect>
                  <g class="guides">
                    <line x1="148.5" y1="10" x2="148.5" y2="200"></line>
                    <line x1="10" y1="105" x2="287" y2="105"></line>
                  </g>
                  <g id="mini-svgG"></g>
                </svg>
              </div>
            </div>
          </div>

          <!-- ファイル -->
          <div class="card upper-card upload-card">
            <div class="hd"><div class="ttl">ファイルアップロード</div></div>
            <div class="bd">
              <label id="dropzone" class="dropzone">ここにファイルをドラッグ＆ドロップ、またはクリックして選択</label>
              <input id="fileInput" class="file-input" type="file" multiple>
              <div class="thumbs-scroll"><div id="thumbs"></div></div>
            </div>
          </div>
        </div>

        <!-- 受注明細 -->
        <div class="bd order-lower">
          <div class="inline" style="justify-content:space-between;margin-bottom:8px">
            <div class="inline" style="gap:8px">
              <label>輸出管理番号 <input placeholder="例：XXXXX-YYYY" style="border:1px solid #d1d5da;border-radius:10px;padding:6px 10px"></label>
              <label>備考1 <input placeholder="自由記述" style="border:1px solid #d1d5da;border-radius:10px;padding:6px 10px"></label>
              <label>備考2 <input placeholder="自由記述" style="border:1px solid #d1d5da;border-radius:10px;padding:6px 10px"></label>
            </div>
            <button class="btn brand" id="addRow" type="button">＋ 明細行</button>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>操作</th><th>行</th><th>状態</th><th>課税</th><th>梱包</th><th>商品大項目</th><th>商品中項目</th>
                  <th>商品詳細</th><th class="num">W</th><th class="num">H</th><th class="num">M3</th>
                  <th>荷姿</th><th class="num">重量</th><th class="num">M3単価</th>
                  <th class="num">商品単価</th><th class="num">数量</th><th class="stickyR num">金額</th>
                </tr>
              </thead>
              <tbody id="details-tbody"></tbody>
            </table>
          </div>

          <div class="sumbar" style="margin-top:8px">
            <div class="btn">小計 <span id="s-sub">0</span></div>
            <div class="btn">課税対象 <span id="s-taxable">0</span></div>
            <div class="btn">消費税 <span id="s-tax">0</span></div>
            <div class="btn" style="background:#e8fff1;border-color:#c7f3d7;color:#0b5c2b;font-weight:900">合計 <span id="s-grand">0</span></div>
          </div>
        </div>
      </div>

      <!-- ケースマーク設計 -->
      <div id="panel-casemark" class="panel">
        <div class="bd cm-designer">
          <div class="designer-left">
            <div class="seg" id="a4seg"><button class="active" data-o="land">A4 横</button><button data-o="port">A4 縦</button></div>
            <div class="canvas" style="margin-top:8px">
              <svg id="svg" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="277" height="190" class="page"></rect>
                <g class="guides">
                  <line x1="148.5" y1="10" x2="148.5" y2="200"></line>
                  <line x1="10" y1="105" x2="287" y2="105"></line>
                </g>
                <g id="svgG"></g>
                <g id="selection"></g>
              </svg>
            </div>
          </div>
          <div>
            <div class="elem-list">
              <div class="inline" style="gap:6px">
                <button class="btn small" id="addT">＋テキスト</button>
                <button class="btn small" id="addR">＋長方形</button>
                <button class="btn small" id="addDsm">＋ひし形(小)</button>
                <button class="btn small" id="addDlg">＋ひし形(大)</button>
                <span style="flex:1"></span>
                <button class="btn brand small" id="arrange">整列</button>
              </div>
              <div id="elemList" style="overflow:auto"></div>

              <div id="prop" class="basic-col" style="margin-top:auto">
                <div class="group-ttl">プロパティ</div>
                <div class="row"><label>文字寄せ</label>
                  <div class="seg" id="p-align">
                    <button data-align="start" class="active">左寄せ</button>
                    <button data-align="middle">中央</button>
                    <button data-align="end">右寄せ</button>
                  </div>
                </div>
                <div class="row"><label>F-Size(px)</label><input id="p-font" class="prop-input" type="number" step="0.1"></div>
                <div class="row"><label>W (mm)</label><input id="p-w" class="prop-input" type="number" step="0.1"></div>
                <div class="row"><label>H (mm)</label><input id="p-h" class="prop-input" type="number" step="0.1"></div>
                <div class="row"><label>X (mm)</label><input id="p-x" class="prop-input" type="number" step="0.1"></div>
                <div class="row"><label>Y (mm)</label><input id="p-y" class="prop-input" type="number" step="0.1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</div>
<script type="module" src="assets/js/main.js"></script>
</body>
</html>
