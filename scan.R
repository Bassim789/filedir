library(jsonlite)
library(tools)
library(stringr)

get_path_end <- function(path){
  path_parts <- strsplit(path, '/')
  path_parts[[1]][length(path_parts[[1]])]
}
get_path_start <- function(path){
  substr(path, 1, nchar(path) - nchar(get_path_end(path)))
}

start <- as.numeric(Sys.time())

file <- file("path_to_scan.txt", "r")
path_to_scan <- readLines(file, n=1, warn=FALSE)
close(file)

if(length(path_to_scan) < 1){
  path_to_scan <- getwd()
} else if(nchar(str_trim(path_to_scan)) == 0){
  path_to_scan <- getwd()
}

if(substr(path_to_scan, nchar(path_to_scan), nchar(path_to_scan) + 1) == '/'){
  path_to_scan <- substr(path_to_scan, 0, nchar(path_to_scan) - 1)
}

print(paste('scan', path_to_scan))

root_path <- get_path_start(path_to_scan)
folder_to_scan <- get_path_end(path_to_scan)

directories <- list()
files <- list()

for(dir_path in list.dirs(path=path_to_scan, full.names=TRUE, recursive=TRUE)){
  
  directory <- get_path_end(dir_path)
  
  root <- substr(
    dir_path, 
    nchar(path_to_scan) - nchar(folder_to_scan) + 1, 
    nchar(dir_path) - nchar(directory) - 1
  )
  key <- substr(
    dir_path, 
    nchar(path_to_scan) - nchar(folder_to_scan) + 1, 
    nchar(dir_path)
  )
  
  directories[[key]] <- list(
    path = root,
    directory = directory,
    nb_folder = 0,
    nb_file = 0,
    size = 0,
    file_types = list()
  )
  
  key <- ''
  for(directory_path in strsplit(root, '/')[[1]]){
    if(key == ''){
      key <- directory_path
    } else {
      key <- paste(key, '/', directory_path, sep='')
    }
    directories[[key]]$nb_folder <- directories[[key]]$nb_folder + 1
  }
}

i <- 0
for(file_path in list.files(path=path_to_scan, full.names=TRUE, recursive=TRUE)){
  i <- i + 1
  
  file_metadata <- file.info(file_path)
  size <- file_metadata$size
  last_modif <- as.numeric(file_metadata$mtime)
  
  file_name <- get_path_end(file_path)
  root <- substr(
    file_path, 
    nchar(path_to_scan) - nchar(folder_to_scan) + 1, 
    nchar(file_path) - nchar(file_name) - 1
  )
  file_key <- substr(
    file_path, 
    nchar(path_to_scan) - nchar(folder_to_scan) + 1, 
    nchar(file_path)
  )
  
  files[[i]] <- list(
    path = root,
    file_name = file_name,
    size = size,
    last_modif = last_modif
  )
  
  file_type <- file_ext(file_name)
  if(file_type == '') file_type <- '__nothing__'

  key <- ''
  for(directory_path in strsplit(root, '/')[[1]]){
    if(key == ''){
      key <- directory_path
    } else {
      key <- paste(key, '/', directory_path, sep='')
    }

    directories[[key]]$nb_file <- directories[[key]]$nb_file + 1
    directories[[key]]$size <- directories[[key]]$size + size

    if(is.null(directories[[key]]$file_types[[file_type]])){
      directories[[key]]$file_types[[file_type]] <- list(
        nb_file = 0,
        size = 0
      )
    }

    directories[[key]]$file_types[[file_type]]$nb_file =
      directories[[key]]$file_types[[file_type]]$nb_file + 1

    directories[[key]]$file_types[[file_type]]$size =
      directories[[key]]$file_types[[file_type]]$size + size
  }
}

duration <- round(as.numeric(Sys.time()) - start, digits=1)

main_data <- list(
  root_path = root_path,
  folder_to_scan = folder_to_scan,
  file_type_icons = file_path_sans_ext(list.files(path='web/media/img/file_icon')),
  scan_timestamp = round(as.numeric(Sys.time())),
  scan_duration = duration
)

data <- list(
  main_data = main_data,
  directories_data = directories,
  files_data = files
)

write_json(data, 'data.json.js', pretty=TRUE, auto_unbox=TRUE)

file_connexion <- file('data.json.js', 'r+')
content <- paste(readLines(file_connexion), collapse="\n")
writeLines(paste("const data = ", content, sep = "\n"), con = file_connexion)
close(file_connexion)
print(paste('done in', duration, 'seconds'))
