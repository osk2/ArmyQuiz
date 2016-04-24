<?
	
	$data = json_decode(file_get_contents("php://input"), TRUE);
	$file = fopen("pending_feedback.json", "a+");
	$content = 
	"{
	\"question\": \"". $data["question"] ."\",
	\"provider\": \"". $data["name"]."\",
	\"answers\": [
		{
			\"title\": \"". $data["answers"][1] ."\",
			\"correct\": true
		},
		{
			\"title\": \"". $data["answers"][2] ."\",
			\"correct\": false
		},
		{
			\"title\": \"". $data["answers"][3] ."\",
			\"correct\": false
		},
		{
			\"title\": \"". $data["answers"][4] ."\",
			\"correct\": false
		}
	]
},\r\n";

	if (fwrite($file, $content) !== false) {
		fclose($file);
		$output = array("success" => true, "message" => "傳送成功");
	} else {
		fclose($file);
		$output = array("success" => false, "message" => "發生未知錯誤，請再試一次");
	}

	header("Content-Type: application/json; charset=utf-8");
	echo json_encode($output);

?>
