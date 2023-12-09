package main

import (
    "embed"
	"io/fs"
	"log"
	"net/http"
	"os/exec"
	"runtime"
)


//go:embed all:src
var assets embed.FS

func Assets() (fs.FS, error) {
	return fs.Sub(assets, "src")
}


func open(url string) error {
    var cmd string
    var args []string

    switch runtime.GOOS {
    case "windows":
        cmd = "cmd"
        args = []string{"/c", "start"}
    case "darwin":
        cmd = "open"
    default: // "linux", "freebsd", "openbsd", "netbsd"
        cmd = "xdg-open"
    }
    args = append(args, url)
    return exec.Command(cmd, args...).Start()
}

func main() {
    assets, _ := Assets()


    fs := http.FileServer(http.FS(assets))
    http.Handle("/", http.StripPrefix("/", fs))

	log.Print("Listening on 127.0.0.1:5000...")

	open("http://127.0.0.1:5000")
	
    err := http.ListenAndServe("127.0.0.1:5000", nil)
	if err != nil {
		log.Fatal(err)
	}

}