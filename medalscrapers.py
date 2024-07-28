from urllib3 import poolmanager
from bs4 import BeautifulSoup

def get_soup():
    cb = poolmanager.PoolManager()
    html = cb.request("GET","https://en.wikipedia.org/wiki/2024_Summer_Olympics_medal_table")
    soup = BeautifulSoup(html.data)
    return soup

import pandas as pd
import numpy as np

def MedalSoupIntoPandas(soup):
    df_medals = pd.DataFrame(columns = ["Rank","Country","Gold","Silver","Bronze"])
                             
    table = soup.find_all("table")[3]
    print(table)
    trs = table.find_all("tr")

    lr = 1
    for row in trs[1:-1]:
        tds = row.find_all("td")
        th = row.find("th")
        c = th.get_text().replace("*","")[1:]
        r = int(tds[0].get_text())
        if (r==0 or (r==1 and lr!=1)):
            print("Sets")
            r = lr
        else:
            lr = r
        print(r,lr)
        g = tds[-4].get_text()
        s = tds[-3].get_text()
        b = tds[-2].get_text()
        rowdict = {"Rank":r,"Country":c,"Gold":g,"Silver":s,"Bronze":b}
        
        df_medals = pd.concat([df_medals, pd.DataFrame([rowdict])])
    return df_medals

if __name__ == "__main__":
    m = MedalSoupIntoPandas(get_soup())
    m.to_csv("medals.csv",index=False)
    print(m)