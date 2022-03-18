::Mark Sherriff 2022
@echo off

::insert project variables below
set prjName=Translator-Mobile
set prjPath=/Users\marke\React-Native\Translator-Mobile
set andStudio=/Program Files\Android\Android Studio\bin

::testing for android
cd %andStudio%
start studio64.exe
cd %prjPath%
start cmd.exe @cmd /k (
echo Continue after starting an android emulator of your choice or an emulator will start automatically
code . && pause && npx react-native run-android
)