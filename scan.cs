using System;
using System.IO;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using System.Linq;
using System.Diagnostics;

class Scan {
	
	static List<string> directories = new List<string>();
	static List<string> files = new List<string>();
	
	static void Main(string[] args) {
		
		Stopwatch watch = new Stopwatch();
		watch.Start();
		DateTime unix_start_time = new DateTime(1970, 1, 1,2,0,0, DateTimeKind.Utc);
		
		var this_path = System.IO.Path.GetDirectoryName(Application.ExecutablePath);
		string path_to_scan = File.ReadLines(this_path + "/path_to_scan.txt").First();
		
		if(path_to_scan.EndsWith("\\")){
			path_to_scan = path_to_scan.Substring(0, path_to_scan.Length - 1);
		}
		
		string folder_to_scan = path_to_scan.Split('\\').Last();
		string root_path = path_to_scan.Substring(0, path_to_scan.Length - folder_to_scan.Length);
		root_path = root_path.Replace(@"\", "/");
		
		Console.WriteLine("scan: " + path_to_scan);
		
		IDictionary<string, dynamic> directories_data = new Dictionary<string, dynamic>();
		
		directories.Add(path_to_scan);
		folder_scan(path_to_scan);
		foreach (string directory_raw in directories){
			string full_path = directory_raw.Replace(@"\", "/");
			string directory = full_path.Split('/').Last();
			string root = full_path.Substring(root_path.Length);
			
			string key;
			if(folder_to_scan == root){
				root = "";
				key = directory;
			} else {
				root = root.Substring(0, root.Length - directory.Length - 1);
				key = root + '/' + directory;
			}
			
			directories_data[key] = new Dictionary<string, dynamic>(){
				{"path", root},
				{"directory", directory},
				{"nb_folder", 0},
				{"nb_file", 0},
				{"size", 0},
				{"file_types", new Dictionary<string, dynamic>()}
			};
			
			key = "";
			foreach (string directory_path in root.Split('/')){
				if(key == ""){
					key = directory_path;
				} else {
					key += '/' + directory_path;
				}
				if(key == "") continue;
				directories_data[key]["nb_folder"] += 1;
			}
		}
		
		List<dynamic> files_data = new List<dynamic>();
		
		file_scan(path_to_scan);
		foreach (string file_raw in files){
		
			string file = file_raw.Replace(@"\", "/");
			string file_name = file.Split('/').Last();
			string root_and_file = file.Substring(root_path.Length);
			string root = root_and_file.Substring(0, root_and_file.Length - file_name.Length - 1);
			
			long size = 0;
			double last_modif = 0;
			try{
				size = new FileInfo(file_raw).Length;
				last_modif = (File.GetLastWriteTime(file_raw) - unix_start_time).TotalSeconds;
			} catch(Exception){}
			
			files_data.Add(new Dictionary<string, dynamic>(){
				{"path", root},
				{"file_name", file_name},
				{"size", size},
				{"last_modif", last_modif}
			});
			
			string file_type_raw = Path.GetExtension(file_name);
			string file_type;
			if(file_type_raw == null ^ file_type_raw == ""){
				file_type = "__nothing__";
			} else {
				file_type = file_type_raw.Substring(1);
			}
			
			string key = "";
			foreach (string directory_path in root.Split('/')){
				if(key == ""){
					key = directory_path;
				} else {
					key += '/' + directory_path;
				}
				if(key == "") continue;
				
				directories_data[key]["nb_file"] += 1;
				directories_data[key]["size"] += size;
				
				if(!directories_data[key]["file_types"].ContainsKey(file_type)){
					directories_data[key]["file_types"][file_type] = new Dictionary<string, int>(){
						{"nb_file", 0},
						{"size", 0}
					};
				}
				directories_data[key]["file_types"][file_type]["nb_file"] += 1;
				directories_data[key]["file_types"][file_type]["size"] += size;
			}
		}
		
		List<string> file_type_icons = new List<string>(); 
		foreach (string image_path in Directory.GetFiles(this_path + "/web/media/img/file_icon")){
			string image = Path.GetFileNameWithoutExtension(image_path.Split('\\').Last());
			file_type_icons.Add(image);
		}
		
		double now = (DateTime.Now - unix_start_time).TotalSeconds;
		
		watch.Stop();
		double duration = Math.Round(watch.Elapsed.TotalSeconds, 1);
   
		IDictionary<string, dynamic> main_data = new Dictionary<string, dynamic>(){
			{"root_path", root_path},
			{"folder_to_scan", folder_to_scan},
			{"file_type_icons", file_type_icons},
			{"scan_timestamp", now},
			{"scan_duration", duration}
		};
	
		IDictionary<string, dynamic> data = new Dictionary<string, dynamic>(){
			{"main_data", main_data},
			{"directories_data", directories_data},
			{"files_data", files_data}
		};
		
		var serializer = new JavaScriptSerializer{MaxJsonLength = Int32.MaxValue};
		var data_json = serializer.Serialize(data);
		data_json = "const data = " + data_json;
		System.IO.File.WriteAllText(this_path + "/data.json.js", data_json);
		
		Console.WriteLine("done in " + duration + " seconds");
		Console.ReadKey();
	}
	
	// recursive methode to get all directories
	static void folder_scan(string path){
		foreach (string directory in Directory.GetDirectories(path)){
			directories.Add(directory);
			try{
				folder_scan(directory);
			} catch{}
		}
	}
	// recursive methode to get all files
	static void file_scan(string path){
		foreach (string file in Directory.GetFiles(path)){
			files.Add(file);
		}
		file_scan_recursive(path);
	}
	static void file_scan_recursive(string path){
		foreach (string directory in Directory.GetDirectories(path)){
			try{
				foreach (string file in Directory.GetFiles(directory)){
					files.Add(file);
				}
			} catch{}
			try{
				file_scan_recursive(directory);
			} catch{}
		}
	}
}
