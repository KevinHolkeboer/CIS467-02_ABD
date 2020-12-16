import os
import xlrd
import pandas
from flask import Flask, flash, request, redirect, url_for, send_from_directory, jsonify, send_from_directory
from flask_cors import CORS
import sys

basedir = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = basedir + '/ExcelFiles'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config['CORS_ORIGINS'] = ['https://brandapp.alliancebeverage.com']
cors = CORS(app)

@app.route('/test', methods = ['POST'])
def test():
    print("hello from API")
    return ('', 200)


@app.route('/upload', methods = ['POST'])
def upload():
    file = request.files['file']
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    product_Data= pandas.read_excel(file, sheet_name='Product')
    Product_Data_Json = product_Data.to_json(orient='records')

    return Product_Data_Json, 201
    


@app.route('/calculateNew', methods = ['POST'])

def calculateNew():
    ItemKey = request.get_json(force=True)
    print(ItemKey,  file=sys.stderr)
    request
    return ItemKey, 200

@app.route('/calculateExisting', methods = ['POST'])
def calculateExisting():
    NewBev = request.get_json(force=True)
    print(NewBev,  file=sys.stderr)
    try:
        return send_from_directory(UPLOAD_FOLDER, "combined_data_test.xlsx", as_attachment=True)
    except:
        return ("oops", 404)




@app.route('/login', methods = ['POST'])
def login():
    creds = request.get_json(force=True)
    if(creds['creds']['username'] == "sd" and creds['creds']['username']  == "sd"):
        return ("", 201)   
    else:
        return ("", 200)
    


from rpy2.robjects import r

# Choosing a CRAN Mirror
#import rpy2.robjects.packages as rpackages
#utils = rpackages.importr('utils')
#utils.chooseCRANmirror(ind=1)

#from rpy2.robjects.vectors import StrVector
#packages = ("tidyverse", "naivebayes", "fpc", "dbscan", "tidymodels", "xlsx",
#"devtools", "ape", "cluster", "openxlsx", "clustertend", "clv", "clValid", "dendextend", "fpc", "gridExtra",
#"mvtnorm", "mvoutlier", "NbClust", "outliers", "psych", "pvclust", "readxl", "Rtsne")

# #Run this once to install the packages
#utils.install_packages(StrVector(packages))

#r('library(devtools)')
# #These packages get installed when updated and on initial run
#r('devtools::install_github("kassambara/factoextra")')
#r('devtools::install_github("mhahsler/dbscan")')

# #Load R libraries 
#NOTE: (Some packages are in the code as package::function)
r('''
library(ape)
library(cluster)
library(clustertend)
library(clv)
library(clValid)
library(dbscan)
library(dendextend)
library(factoextra)
library(fpc)
library(gridExtra)
library(mvtnorm)
library(mvoutlier)
library(naivebayes)
library(NbClust)
library(outliers)
library(psych)
library(pvclust)
library(Rtnse)
library(tidyverse)
library(tidymodels)
library(xlsx)
''')

#USE TO TEST BASIC R STUFF WORKS
r('print("Libraries installed and loaded")')
r('x <- rnorm(100)')
r('print(x)')

#import rpy2.robjects as robjects

#Read files into R
#r(db <- readxl::read_xlsx("combined_data.xlsx", sheet="Product"))
#r(census <- readxl::read_xlsx("combined_data.xlsx", sheet = "Census"))

#Check the column names to ensure all columns exist
"""r(```
   if(!(colnames(db) %in% c("ItemKey", "ItemName", "BeverageType", "Package", "PackName", "FrontlinePrice")) |
   !(colnames(census) %in% c("ClstZIP", "ZIP_Pop_Density", "ZIP_med_income", "ZIP_med_age", "ZIP_P_Black", "ZIP_P_Asian", "ZIP_P_Hispanic"))){
     #SEND ERROR TO FRONTEND SOMEHOW!!!!!
   }
"""

""" if(NEW BEVERAGE){
# Obtain product data and normalize
r('''
  db <- readxl::read_xlsx("combined_data.xlsx", sheet = "Product")
  rec <- 
  recipe(formula = ~ FrontlinePrice + BeverageType + Package, data = db) %>% 
  step_range(all_numeric()) %>% 
  step_dummy(all_nominal(), one_hot=T) %>%
  prep()
  normalized <- juice(rec)
  ''')

# Cluster data and signify clusters
r('''
set.seed(123)
f <- dbscan::dbscan(normalized, 1.35, 5)
normalized$CLUSTER=f$cluster
normalized$CLUSTER <- as.factor(normalized$CLUSTER)
db$Cluster=normalized$CLUSTER
''')

# Separate train and test data 
r('''
ind <- sample(2, nrow(normalized), replace = T, prob = c(0.8, 0.2))
train <- normalized[ind == 1,]
test <- normalized[ind == 2,]
''')

# Train naive bayes model
r('model <- naive_bayes(CLUSTER ~ ., data = train)')

# Confusion Matrix - train data
r('''
p1 <- predict(model, train)
tab1 <- table(p1, train$CLUSTER)
1 - sum(diag(tab1)) / sum(tab1)
''')

# Confusion Matrix - test data
r('''
p2 <- predict(model, test)
tab2 <- table(p2, test$CLUSTER)
1 - sum(diag(tab2)) / sum(tab2)
''')

# To Replace with User Input
r('''
newPrice <- 750
newBevType <- "IMPORT BEER"
newSize <- "1 GALL (4)"
''')

# Normalize user input
r('''
newPrice <- (newPrice-min(db$FrontlinePrice))/(max(db$FrontlinePrice)-min(db$FrontlinePrice))

newBevType <- str_replace_all(newBevType, " ", ".")
newBevType <- paste("BeverageType_", newBevType, sep="")

newSize <- str_replace_all(newSize, " ", ".")
newSize <- str_replace_all(newSize, "/", ".")
newSize <- str_replace_all(newSize, "\\(", ".")
newSize <- str_replace_all(newSize, "\\)", ".")
newSize <- paste("Package_X", newSize, sep="")

newProduct <- vector(mode="numeric", length=ncol(normalized))

newProduct[match("FrontlinePrice", names(normalized))] <- newPrice
newProduct[match(newBevType, names(normalized))] <- 1
newProduct[match(newSize, names(normalized))] <- 1
''')

# Form data frame for normalized user input
r('''
newProduct <- as.data.frame(t(newProduct))
colnames(newProduct) <- colnames(normalized[,1:ncol(normalized)-1])
''')

# Use Naive Bayes model to predict cluster
r('clusterPredict <- predict(model, newProduct)')

# Get all items within the predicted cluster
r('''
inCluster <- subset(db, Cluster == clusterPredict)
itemList <- inCluster[['ItemKey']]
''')

# Get list of customers that sell items within the predicted cluster
r('''
Customer_Product <- readxl::read_xlsx("combined_data.xlsx", sheet = "Customer-Product")

i = 1
custList <- vector()
for(ID in itemList) {
  temp <- subset(Customer_Product, ItemKey == itemList[i])
  custList <- c(custList, temp["CusKey"])
  i = i + 1
}

custList <- unlist(custList, recursive = FALSE)
custList <- unname(custList)
custList <- unique(custList)
''')

# Get table of customers that sold these items
r('''
isFirst = TRUE
for (ID in itemList) {
  if (isFirst) {
    items <- subset(Customer_Product, ItemKey == ID)
    isFirst = FALSE
  }
  else {
    temp <- subset(Customer_Product, ItemKey == ID)
    items <- rbind(items, temp)
  }
}

isFirst = TRUE
for (ID in custList) {
  if (isFirst) {
    itemSellers <- subset(items, CusKey == ID)
    isFirst = FALSE
  }
  else {
    temp <- subset(items, CusKey == ID)
    itemSellers <- rbind(itemSellers, temp)
  }
}
''')

# Get updated customer list
r('''
custList <- itemSellers[['CusKey']]
custList <- unique(custList)
''')

# For each customer get the net revenue of all cluster items sold by specific customer
r('''
custProfit <- vector()
for (ID in custList) {
  temp <- subset(itemSellers, CusKey == ID)
  custProfit <- c(custProfit, sum(temp$NetRevenue))
}
''')

# Get table of these customers
r('''
customers <- readxl::read_xlsx("combined_data.xlsx", sheet = "Customer")

isFirst = TRUE
for (ID in custList) {
  if (isFirst) {
    newPrediction <- subset(customers, CusKey == ID)
    isFirst = FALSE
  }
  else {
    temp <- subset(customers, CusKey == ID)
    newPrediction <- rbind(newPrediction, temp)
  }
}
''')

# Replace NetRevenue column (originally total customer revenue) with new NetRevenue
#(NetRevenue of customer sales on cluster items)
r('newPrediction$NetRevenue <- custProfit')

# Order by NetRevenue and get top 10%
r('''
newPrediction  <- newPrediction [order(-newPrediction $NetRevenue),]

top10Percent = ceiling(nrow(newPrediction ) * 0.10)

newPrediction  <- head(newPrediction , top10Percent)

openxlsx::write.xlsx(newPrediction, "NewProductRecommendation.xlsx", sheetName = "New Product Recommendations")
''')
}

if(EXISTING BEVERAGE){
    # Get Census data and update to numeric values
    r('''
    census <- readxl::read_xlsx("combined_data.xlsx", sheet = "Census")

    census$ZIP_Pop_Density <- as.numeric(census$ZIP_Pop_Density)
    census$ZIP_med_income <- as.numeric(census$ZIP_med_income)
    census$ZIP_med_age <- as.numeric(census$ZIP_med_age)
    census$ZIP_P_Black <- as.numeric(census$ZIP_P_Black)
    census$ZIP_P_Asian <- as.numeric(census$ZIP_P_Asian)
    census$ZIP_P_Hispanic <- as.numeric(census$ZIP_P_Hispanic)

    census <- na.omit(census)

    ef <- census
    ''')

    # Transform data
    r('''
    a <- min(census$ZIP_Pop_Density[census$ZIP_Pop_Density>0])-.0001
    g <- min(census$ZIP_P_Black[census$ZIP_P_Black>0])-.0001
    h <- min(census$ZIP_P_Asian[census$ZIP_P_Asian>0])-.0001
    i <- min(census$ZIP_P_Hispanic[census$ZIP_P_Hispanic>0])-.0001
    census %>%
    mutate( 
        pd.log = log(ifelse(ZIP_Pop_Density==0,a,ZIP_Pop_Density)),
        pBl.log = log(ifelse(ZIP_P_Black==0,g,ZIP_P_Black)),
        pAn.log = log(ifelse(ZIP_P_Asian==0,h,ZIP_P_Asian)),
        pHL.log = log(ifelse(ZIP_P_Hispanic==0,i,ZIP_P_Hispanic))
    ) -> census
    ''')

    # Normalize data
    r('sccensus <- scale(census)')

    # Hierarchical clustering
    r('''
    sccensus <- census %>% 
    dplyr::select(2:3, 7:10) %>% 
    scale()
    set.seed(4323)
    sccensus %>%
        dist() %>%
        hclust() -> census.hclust
    fviz_dend(census.hclust, k = 16, rect = TRUE, rect_fill = TRUE, lwd = 0.5, cex = 0.5) # pop_dens, med_age, %s, med_inc)
    ''')

    # Hierarchical cuts
    r('''
    R16 <- ef %>%
    mutate(cluster = cutree(census.hclust,16))
    ''')

    # To be replaced with user input
    r('itemkey <- "83914"')

    # Get customers that sell the specific product
    r('''
    Customer_Product <- readxl::read_xlsx("combined_data.xlsx", sheet = "Customer-Product")

    soldItem <- subset(Customer_Product, ItemKey == itemkey)
    ''')

    # Narrow down to only top 10% of customers
    r('''
    soldItem <- soldItem[order(soldItem$NetRevenue),]

    top10Percent = ceiling(nrow(soldItem) * 0.10)

    topSellers <- head(soldItem, top10Percent)

    cusList <- topSellers[['CusKey']]
    ''')

    # Get zip of customers
    r('''
    customers <- readxl::read_xlsx("combined_data.xlsx", sheet = "Customer")

    i = 1
    zipList <- character()
    for(ID in cusList) {
        temp <- subset(customers, CusKey == cusList[i])
        zipList <- c(zipList, as.character(temp[1, "ShipZip"]))
        i = i + 1
    }
    ''')

    # Determine which cluster theze zips belong to
    r('''
    getMode <- function(v) {
    uniqv <- unique(v)
    uniqv[which.max(tabulate(match(v, uniqv)))]
    }

    BestZIP <- getMode(zipList)

    BestZIPCluster <- subset(R16, ClstZIP == BestZIP)
    BestCluster <- as.character(BestZIPCluster[1, "cluster"])
    ''')

    # Get zips from this cluster
    r('''
    similarZones <- subset(R16, cluster == BestCluster)

    similarZips <- similarZones[['ClstZIP']]
    ''')

    # Get customers in these zips
    r('''
    i = 1
    similarCust <- vector()
    for(zips in similarZips) {
        temp <- subset(customers, ShipZip == similarZips[i])
        similarCust <- c(similarCust, temp["CusKey"])
        i = i + 1
    }

    similarCust <- unlist(similarCust, recursive = FALSE)
    similarCust <- unname(similarCust)
    similarCust <- unique(similarCust)
    ''')

    # Remove customers that already sell the product
    r('''
    newCustomers <- vector()
    for (ID in similarCust) {
        temp <- subset(Customer_Product, CusKey == ID & ItemKey == itemkey)
        if (nrow(temp) == 0) {
            newCustomers <- c(newCustomers, ID)
        }
    }
    ''')

    # Build the final data frame
    r('''
    isFirst = TRUE
    for (ID in newCustomers) {
        if (isFirst) {
        oldPrediction  <- subset(customers, CusKey == ID)
        isFirst = FALSE
        } else {
        temp <- subset(customers, CusKey == ID)
        oldPrediction <- rbind(oldPrediction, temp)
        }
    }
    ''')

    # Order data frame by net revenue
    r('''
    oldPrediction <- oldPrediction[order(-oldPrediction$NetRevenue),]
    openxlsx::write.xlsx(oldPrediction, "ExistingProductRecommendation.xlsx", sheetName = "Existing Product Recommendations")
    ''')
} """