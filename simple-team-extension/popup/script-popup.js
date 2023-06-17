const KEY_DATA_LOCAL_STORAGE = "saveData"
const Parameters = {
    ALL: 'all',
    FILE: 'file',
    SHARDS: 'shards',
    SUITE_CASE_ID: 'suite_case_id',
    BRANCH: 'branch',
    JOB_ID: 'job_id',
    SLACK_ID: 'slack_id',
    JOB_NAME: 'job_name',
    JOB_RUN_MODE: 'job_run_mode',
    JOB_CREATED_BY_MAIL: 'job_created_by_mail',
    PROXY_URL: 'proxy_url'
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

const selectField = {
    all: true,
    test_file: false,
    case_id: false,
    shards: false,
    suite_case_id: false,
    branch: false,
    job_id: false,
    slack_id: false,
    job_name: false,
    job_run_mode: false,
    job_created_by_mail: false,
    proxy_url: false
}

function saveData(selectField) {
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // alert(JSON.stringify(selectField))
      const data = {
        test_file: '',
        case_id: ''
    };
    const testFileEl = getElementByXpath("(//div[normalize-space()='TEST_FILE_OR_FOLDER']/following-sibling::div)[1]//input").value;
    if (testFileEl && (selectField.all || selectField.test_file)) {
        data.test_file = testFileEl.value
    }

    const caseIdEl = document.querySelector("#main-panel > form > div.parameters > div:nth-child(3) > div.setting-main > div > input.jenkins-input");
    if (caseIdEl && (selectField.all || selectField.case_id)) {
        data.case_id = caseIdEl.value
    }

    const dataSave = {
        checkbox: selectField,
        data: data
    }
    chrome.storage.local.set({ "saveData": JSON.stringify(dataSave) }); //for save data to Local storage
    // updateDataPreview();
}

function pasteData() {
    const dataPaste = localStorage.getItem("saveData");
    if (dataPaste) {
        const data = JSON.parse(dataPaste);
        const testFileEl = document.querySelector("#main-panel > form > div.parameters > div:nth-child(1) > div.setting-main > div > input.jenkins-input");
        if (testFileEl) {
            testFileEl.value = data.test_file
        }

        const caseIdEl = document.querySelector("#main-panel > form > div.parameters > div:nth-child(3) > div.setting-main > div > input.jenkins-input");
        if (caseIdEl) {
            caseIdEl.value = data.case_id
        }

        const branchEl = document.querySelector("#main-panel > form > div.parameters > div:nth-child(5) > div.setting-main > div > input.jenkins-input");
        if (branchEl) {
            branchEl.value = data.branch
        }
    }
}

document.querySelector('#btn-copy').addEventListener('click', async () => {
    chrome.scripting.executeScript({
        target: { tabId: (await getCurrentTab()).id },
        func: saveData,
        args: [selectField]
    });
});

document.querySelector('#btn-paste').addEventListener('click', async () => {
    chrome.scripting.executeScript({
        target: { tabId: (await getCurrentTab()).id },
        func: pasteData
    });
});

document.querySelector('#ckb-all').addEventListener('click', async () => {
    chrome.scripting.executeScript({
        target: { tabId: (await getCurrentTab()).id },
        func: checkOnCheckbox(Parameters.ALL)
    });
});
document.querySelector('#ckb-file').addEventListener('click', async () => {
    chrome.scripting.executeScript({
        target: { tabId: (await getCurrentTab()).id },
        func: checkOnCheckbox(Parameters.FILE)
    });
});

function checkOnCheckbox(type) {
    switch (type) {
        case Parameters.ALL:
            const ckbAllChecked = document.getElementById('ckb-all').checked
            document.getElementById('ckb-file').checked = ckbAllChecked;
            document.getElementById('ckb-shards').checked = ckbAllChecked;
            document.getElementById('ckb-suite-case-id').checked = ckbAllChecked;
            document.getElementById('ckb-branch').checked = ckbAllChecked;
            document.getElementById('ckb-job-id').checked = ckbAllChecked;
            document.getElementById('ckb-slack-id').checked = ckbAllChecked;
            document.getElementById('ckb-job-name').checked = ckbAllChecked;
            document.getElementById('ckb-job-run-mode').checked = ckbAllChecked;
            document.getElementById('ckb-job-created-by-mail').checked = ckbAllChecked;
            document.getElementById('ckb-proxy-url').checked = ckbAllChecked;
            break;
        case Parameters.FILE:
            selectField.test_file = true;
            break;
        case Parameters.SHARDS:
            selectField.shards = true;
            break;
        case Parameters.SUITE_CASE_ID:
            selectField.suite_case_id = true;
            break;
        case Parameters.BRANCH:
            selectField.branch = true;
            break;
        case Parameters.JOB_ID:
            selectField.job_id = true;
            break;
        case Parameters.SLACK_ID:
            selectField.slack_id = true;
            break;
        case Parameters.JOB_NAME:
            selectField.job_name = true;
            break;
        case Parameters.JOB_RUN_MODE:
            selectField.job_run_mode = true;
            break;
        case Parameters.JOB_CREATED_BY_MAIL:
            selectField.job_created_by_mail = true;
            break;
        case Parameters.PROXY_URL:
            selectField.proxy_url = true;
            break;
        default:
        // code block
    }
}

async function updateDataPreview() {
    console.log('aaaaaaaaaaaa');
    const rawData = localStorage.getItem("saveData");
    // const a = chrome.storage.local.get(['saveData'])
    // alert(dataInLocalSR);

    if (rawData) {
        const parseData = JSON.parse(rawData);
        const checkboxes = parseData.checkbox;

        console.log('checkboxes: ', checkboxes);

        if (checkboxes) {
            selectField.all = checkboxes.all;
            selectField.test_file = checkboxes.test_file;
            selectField.shards = checkboxes.shards;
        }
        if (selectField.all) {
            document.getElementById('ckb-all').checked = true;
            checkOnCheckbox(Parameters.ALL)
        } else {
            if (selectField.test_file) {
                document.getElementById('ckb-file').checked = true;
            }
            if (selectField.shards) {
                document.getElementById('ckb-shards').checked = true;
            }
        }
        const dataInSR = parseData.data
        if (dataInSR) {
            if (selectField.all || selectField.test_file) {
                document.getElementById('a').innerHTML = dataInSR.test_file;
            }
            if (selectField.all || selectField.shards) {
                document.getElementById('b').innerHTML = dataInSR.shards;
            }
        }
    }

}

async function getData() {
    // chrome.storage.local.get('saveData', function (result) {
    //     alert(result.saveData)
    // });
    await updateDataPreview();
    // alert(saveData(selectField));

    const data = localStorage.getItem(KEY_DATA_LOCAL_STORAGE);
    console.log('data from localstorage: ', data);
};

getData();

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log('Got response: ', response);
});