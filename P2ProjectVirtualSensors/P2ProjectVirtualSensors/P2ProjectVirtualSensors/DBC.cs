using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace P2ProjectVirtualSensors
{
    class DBC
    {
        public static DataTable Get_DataTable(string SQL_Text, List<DBT.DT> SetTargetValues, List<string> SetTargetAttributes, string ConnectString)
        {
            if (ConnectString == "")
                return null;

            DataTable EnterTable = new DataTable();

            try
            {
                using (SqlConnection ServerConnection = new SqlConnection(ConnectString))
                {
                    ServerConnection.Open();

                    using (SqlDataAdapter DataAdapter = new SqlDataAdapter(SQL_Text, ServerConnection))
                    {
                        if (SetTargetValues.Count > 0)
                            for (int i = 0; i < SetTargetValues.Count; i++)
                                if (SetTargetAttributes[i] == "NULL")
                                    DataAdapter.SelectCommand.Parameters.AddWithValue("@" + DBT.GetColumnName(SetTargetValues[i]), "");
                                else
                                    DataAdapter.SelectCommand.Parameters.AddWithValue("@" + DBT.GetColumnName(SetTargetValues[i]), SetTargetAttributes[i]);

                        DataAdapter.Fill(EnterTable);
                    }

                    ServerConnection.Close();
                }
            }
            catch (SqlException sx)
            {

            }

            return EnterTable;
        }

        public static void Execute_SQL(string SQL_Text, List<DBT.DT> SetTargetValues, List<string> SetTargetAttributes, string ConnectString)
        {
            if (ConnectString == "")
                return;

            try
            {
                using (SqlConnection ServerConnection = new SqlConnection(ConnectString))
                {
                    using (SqlCommand ReturnCommand = new SqlCommand())
                    {
                        ReturnCommand.Connection = ServerConnection;
                        ReturnCommand.CommandText = SQL_Text;

                        if (SetTargetValues.Count > 0)
                            for (int i = 0; i < SetTargetValues.Count; i++)
                                if (SetTargetAttributes[i] == "NULL")
                                    ReturnCommand.Parameters.AddWithValue("@" + DBT.GetColumnName(SetTargetValues[i]), "");
                                else
                                    ReturnCommand.Parameters.AddWithValue("@" + DBT.GetColumnName(SetTargetValues[i]), SetTargetAttributes[i]);

                        ServerConnection.Open();
                        ReturnCommand.ExecuteNonQuery();
                        ServerConnection.Close();
                    }
                }
            }
            catch (SqlException sx)
            {

            }
        }

        public static void AddToDBTable(string ConnectString, string TableName, List<DBT.DT> SetTargetValues, List<string> SetTargetAttributes)
        {
            string UpdateString = "INSERT INTO " + TableName + " (";
            for (int i = 0; i < SetTargetValues.Count; i++)
            {
                UpdateString += DBT.GetColumnName(SetTargetValues[i]);
                if (i + 1 != SetTargetValues.Count)
                    UpdateString += ", ";
            }
            UpdateString += ") VALUES(";
            for (int i = 0; i < SetTargetValues.Count; i++)
            {
                UpdateString += "@" + DBT.GetColumnName(SetTargetValues[i]);
                if (i + 1 != SetTargetValues.Count)
                    UpdateString += ", ";
            }
            UpdateString += ");";

            Execute_SQL(UpdateString, SetTargetValues, SetTargetAttributes, ConnectString);
        }
    }

    // DataBase Types
    class DBT
    {
        // Database Types
        public enum DT
        {
            SensorValue, SensorID
        };
        private static readonly string[] DatabaseTypeNames =
        {
            "SensorValue", "SensorID"
        };

        public static string GetColumnName(DT TargetType)
        {
            return DatabaseTypeNames[(int)TargetType];
        }
    }
}
