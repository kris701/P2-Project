using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Data;

namespace P2ProjectVirtualSensors
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        string Connectstring = "Server=sql6009.site4now.net;Database=DB_A4BDCF_p2projekt;User Id=DB_A4BDCF_p2projekt_admin;Password=a12345678";
        bool Continue = true;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void SendValueSlider_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            ValueLabel.Content = SendValueSlider.Value;
            SendValueSlider.Value = Math.Round(SendValueSlider.Value, 0);
        }

        private async void StartButton_Click(object sender, RoutedEventArgs e)
        {
            StartButton.IsEnabled = false;
            StopButton.IsEnabled = true;
            Continue = true;
            await SendData();
        }

        private void StopButton_Click(object sender, RoutedEventArgs e)
        {
            StartButton.IsEnabled = false;
            StopButton.IsEnabled = true;
            Continue = false;
        }

        async Task SendData()
        {
            while (Continue)
            {
                DBC.AddToDBTable(Connectstring, TargetTableTextbox.Text, new List<DBT.DT> { DBT.DT.SensorID, DBT.DT.SensorValue }, new List<string> { SensorIDTextbox.Text, SendValueSlider.Value.ToString() });
                await Task.Delay(Int32.Parse(TransferDelay.Text) * 1000);
            }
        }
    }
}
