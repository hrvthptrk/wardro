' Wardro szerver inditasa a hatterben, ablak nelkul (a Windows indulasakor fut).
' A felugyelo.js inditja a szervert, es ujrainditja, ha leall.
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
mappa = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = mappa
sh.Run "node """ & mappa & "\felugyelo.js""", 0, False
